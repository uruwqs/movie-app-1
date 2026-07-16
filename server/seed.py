from datetime import datetime
import json
import re

from database import Base, ReadingDB, SessionLocal, engine

# Создаем таблицы в БД
Base.metadata.create_all(bind=engine)


def parse_and_seed():
    db = SessionLocal()

    try:
        # Загружаем JSON
        with open("result.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        messages = data.get("messages", [])
        added_count = 0

        for msg in messages:
            text = msg.get("text")
            date_str = msg.get("date")

            if not text or not date_str:
                continue

            # Telegram export может хранить text как строку или список
            if isinstance(text, list):
                full_text = "".join(
                    chunk.get("text", "") if isinstance(chunk, dict) else str(chunk)
                    for chunk in text
                )
            else:
                full_text = str(text)

            # Определяем место измерения
            if "Atrium" in full_text:
                location = "atrium"
            elif "Outside" in full_text:
                location = "outside"
            else:
                continue

            # Температура (обязательна)
            temp_match = re.search(r"🌡\s*([0-9.]+)", full_text)
            if not temp_match:
                continue

            temperature = float(temp_match.group(1))

            # Освещенность (необязательно)
            brightness = None
            bright_match = re.search(
                r"💡\s*([A-Za-z\s]+?)(?=\s*🔉|$)",
                full_text,
            )
            if bright_match:
                brightness = bright_match.group(1).strip()

            # Уровень шума (необязательно)
            noise = None
            noise_match = re.search(r"🔉\s*([A-Za-z\s]+?)$", full_text)
            if noise_match:
                noise = noise_match.group(1).strip()

            measured_at = datetime.fromisoformat(date_str)

            reading = ReadingDB(
                measured_at=measured_at,
                location=location,
                temperature=temperature,
                brightness=brightness,
                noise=noise,
            )

            db.add(reading)
            added_count += 1

        db.commit()

        print(f"✅ Успешно импортировано {added_count} записей в базу данных SQLite!")

    except FileNotFoundError:
        print("❌ Ошибка: файл result.json не найден!")

    except Exception as e:
        db.rollback()
        print(f"❌ Ошибка при импорте данных: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    parse_and_seed()
