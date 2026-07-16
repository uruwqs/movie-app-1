import datetime
import re
import time
from pathlib import Path
from typing import Optional
import requests
from bs4 import BeautifulSoup
import database

# --- 1. НАСТРОЙКА БАЗЫ ДАННЫХ (SQLAlchemy) ---
# База данных гарантированно создается в той же папке, где лежит этот файл
BASE_DIR = Path(__file__).resolve().parent

SessionLocal = database.SessionLocal


# --- 2. ФУНКЦИЯ ПАРСИНГА СООБЩЕНИЙ ---
def parse_tg_message(text: str, message_date: datetime.datetime) -> Optional[dict]:
    clean_text = re.sub(r"\s+", " ", text).strip()
    if not clean_text:
        return None

    lowered = clean_text.lower()

    # Определяем локацию
    if "atrium" in lowered:
        location = "atrium"
    elif "outside nu" in lowered:
        location = "outside"
    else:
        return None  # Игнорируем левые посты (например, поздравления или праздники)

    # Вытаскиваем температуру
    temp_match = re.search(
        r"🌡\s*(\d+(?:\.\d+)?)\s*(?:°|º)?\s*C", clean_text, re.IGNORECASE
    )
    if temp_match:
        temperature = float(temp_match.group(1))
    else:
        return None

    # Освещение (только для Атриума)
    brightness = None
    if location == "atrium":
        if "dark" in lowered or "dim" in lowered:
            brightness = "Dark"
        elif "bright" in lowered:
            brightness = "Bright"
        else:
            brightness = "Normal"

    # Шум (только для Атриума)
    noise = None
    if location == "atrium":
        if "noisy" in lowered:
            noise = "Noisy"
        elif "mild noise" in lowered:
            noise = "Mild noise"
        else:
            noise = "Quiet"

    return {
        "measured_at": message_date,
        "location": location,
        "temperature": temperature,
        "brightness": brightness,
        "noise": noise,
    }


# --- 3. СКРЕЙПЕР ИСТОРИИ И РЕАЛЬНОГО ВРЕМЕНИ ---
CHANNEL_USERNAME = "test_temp_nu"


def fetch_history_two_months():
    session = SessionLocal()
    now = datetime.datetime.now()
    two_months_ago = now - datetime.timedelta(days=60)

    url = f"https://t.me/s/{CHANNEL_USERNAME}"
    all_parsed_records = []  # Список для сбора постов перед сортировкой
    reached_end = False

    print("⏳ Начинаем глубокое сканирование истории за последние 2 месяца...")

    while not reached_end:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            print("❌ Ошибка сети при запросе истории.")
            break

        soup = BeautifulSoup(response.text, "html.parser")
        messages = soup.find_all("div", class_="tgme_widget_message_wrap")

        if not messages:
            break

        # Находим ID самого старого сообщения на странице, чтобы листать дальше назад
        first_msg_id = None
        for msg in messages:
            inner_msg = msg.find("div", class_="tgme_widget_message")
            if inner_msg and inner_msg.has_attr("data-post"):
                first_msg_id = inner_msg["data-post"].split("/")[-1]
                break

        oldest_msg_date = now

        for msg in messages:
            text_area = msg.find("div", class_="tgme_widget_message_text")
            if not text_area:
                continue
            text = text_area.get_text()

            time_element = msg.find("time", class_="time")
            if not time_element or not time_element.has_attr("datetime"):
                continue

            # Парсим дату и переводим в твой локальный часовой пояс (+5 часов)
            dt_str = time_element["datetime"]
            msg_date_utc = datetime.datetime.fromisoformat(dt_str)
            msg_date = msg_date_utc.astimezone().replace(tzinfo=None)

            if msg_date < oldest_msg_date:
                oldest_msg_date = msg_date

            # Если сообщение старее 2 месяцев — останавливаем сбор
            if msg_date < two_months_ago:
                reached_end = True
                continue

            parsed = parse_tg_message(text, msg_date)
            if parsed:
                all_parsed_records.append(parsed)

        print(
            f"📚 Спарсили пачку сообщений. Самое старое в пачке: {oldest_msg_date.strftime('%Y-%m-%d %H:%M:%S')}"
        )

        if oldest_msg_date < two_months_ago or not first_msg_id:
            break

        # Листаем назад
        url = f"https://t.me/s/{CHANNEL_USERNAME}?before={first_msg_id}"
        time.sleep(1.2)
    # Записываем историю в базу в хронологическом порядке
    if all_parsed_records:
        print("🔄 Сортируем историю от старых к новым для правильных ID...")
        all_parsed_records.sort(key=lambda x: x["measured_at"])

        total_added = 0
        for parsed in all_parsed_records:
            exists = (
                session.query(database.ReadingDB)
                .filter_by(
                    measured_at=parsed["measured_at"], location=parsed["location"]
                )
                .first()
            )

            if not exists:
                db_record = database.ReadingDB(**parsed)
                session.add(db_record)
                total_added += 1

        session.commit()
        print(f"🏁 История успешно сохранена! Добавлено записей: {total_added}")

    session.close()


def check_live_updates():
    session = SessionLocal()
    url = f"https://t.me/s/{CHANNEL_USERNAME}"

    print(
        f"🔄 [{datetime.datetime.now().strftime('%H:%M:%S')}] Проверяем обновления в канале..."
    )

    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            print(f"⚠️ Ошибка! Telegram вернул статус-код: {response.status_code}")
            session.close()
            return
    except Exception as e:
        print(f"❌ Сеть недоступна: {e}")
        session.close()
        return

    soup = BeautifulSoup(response.text, "html.parser")
    messages = soup.find_all("div", class_="tgme_widget_message_wrap")

    if not messages:
        print("⚠️ Не удалось найти посты на веб-странице (возможен временный блок).")
        session.close()
        return

    count = 0
    for msg in messages:
        text_area = msg.find("div", class_="tgme_widget_message_text")
        if not text_area:
            continue

        text = text_area.get_text()

        time_element = msg.find("time", class_="time")
        if not time_element or not time_element.has_attr("datetime"):
            continue

        dt_str = time_element["datetime"]
        msg_date_utc = datetime.datetime.fromisoformat(dt_str)
        msg_date = msg_date_utc.astimezone().replace(tzinfo=None)

        parsed = parse_tg_message(text, msg_date)

        if parsed:
            exists = (
                session.query(database.ReadingDB)
                .filter_by(
                    measured_at=parsed["measured_at"], location=parsed["location"]
                )
                .first()
            )

            if not exists:
                db_record = database.ReadingDB(**parsed)
                session.add(db_record)
                count += 1
                print(
                    f"✨ [ДОБАВЛЕНО]: {parsed['location'].upper()} | "
                    f"{parsed['temperature']}°C | "
                    f"Время: {parsed['measured_at'].strftime('%Y-%m-%d %H:%M:%S')}"
                )

    if count > 0:
        two_months_ago = datetime.datetime.now() - datetime.timedelta(days=60)

        deleted_count = (
            session.query(database.ReadingDB)
            .filter(database.ReadingDB.measured_at < two_months_ago)
            .delete()
        )

        if deleted_count > 0:
            print(f"🧹 Очистка: удалено {deleted_count} старых записей.")

        session.commit()
    else:
        print("ℹ️ Новых постов пока нет.")

    session.close()


def start_parser():
    print("🚀 Парсер действительно запустился!")
    fetch_history_two_months()

    print("\n⏰ Парсер запущен.")

    while True:
        time.sleep(30)
        check_live_updates()


if __name__ == "__main__":
    start_parser()
