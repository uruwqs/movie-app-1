from typing import Optional


DRINKS = [
    {
        "cafe": "Drinkit",
        "name": "Лимонад Юдзу-лайм",
        "price": 2350,
        "type": "cold",
        "reason": "Освежающий цитрусовый лимонад",
    },
    {
        "cafe": "Drinkit",
        "name": "Лимонад лайм-мята",
        "price": 1850,
        "type": "cold",
        "reason": "Освежающий лимонад с лаймом и мятой",
    },
    {
        "cafe": "Drinkit",
        "name": "Айс Матча Манго-кокос",
        "price": 2500,
        "type": "cold",
        "reason": "Холодный матча-напиток с манго",
    },
    {
        "cafe": "Drinkit",
        "name": "Капучино",
        "price": 1550,
        "type": "hot",
        "reason": "Классический горячий кофе",
    },
    {
        "cafe": "Central Coffee",
        "name": "Раф",
        "price": 1290,
        "type": "hot",
        "reason": "Сливочный кофейный напиток",
    },
    {
        "cafe": "Pablo",
        "name": "Клубничный молочный коктейль",
        "price": 1200,
        "type": "cold",
        "reason": "Освежающий молочный коктейль",
    },
]


def get_recommendation(temp: float) -> Optional[dict]:
    if temp >= 28:
        for drink in DRINKS:
            if drink["type"] == "cold":
                return drink

    if temp <= 18:
        for drink in DRINKS:
            if drink["type"] == "hot":
                return drink

    return DRINKS[0]
