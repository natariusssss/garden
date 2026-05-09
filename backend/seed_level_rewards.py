from sqlalchemy.orm import Session
from models import LevelReward
level_rewards_data=[
    {
        "level":5,
        "plant_code":"maple",
        "title":"Награда за 3 уровень",
        "description":"Открыто обычное растение Клен",
    },
    {
        "level":10,
        "plant_code":"palm",
        "title":"Награда за 5 уровень",
        "description":"Открыто редкое растение Пальма",
    },
    {
        "level":15,
        "plant_code":"sequoia",
        "title":"Награда за 10 уровень",
        "description":"Открыто редкое растение Секвойя"
    },
    {
        "level":20,
        "plant_code":"lotos",
        "title":"Награда за 10 уровень",
        "description":"Открыто редкое растение Лотос",
    },
    {
        "level":25,
        "plant_code":"lily",
        "title":"Награда за 13 уровень",
        "description":"Открыто эпическое растение Лотос"
    },
    {
        "level":30,
        "plant_code":"rose",
        "title":"Награда за 15 уровень",
        "description":"Открыто эпическое растение Роза",
    },
    {
        "level":35,
        "plant_code":"dragon",
        "title":"Награда за 17 уровень",
        "description":"Открыто эпическое растение Драконово дерево"
    },
    {
        "level":40,
        "plant_code":"magnolia",
        "title":"Награда за 20 уровень",
        "description":"Открыто легендарное растение Магнолия",
    },
    {
        "level":45,
        "plant_code":"willow",
        "title":"Награда за 23 уровень",
        "description":"Открыто легендарное растение Ива",
    },
    {
        "level":50,
        "plant_code":"sakura",
        "title":"Награда за 25 уровень",
        "description":"Открыто легендарное растение Сакура",
    },
    {
        "level":55,
        "plant_code":"cercis",
        "title":"Награда за 55 уровень",
        "description":"Открыто легендарное растение Церцис",
    },
    {
        "level":60,
        "plant_code":"rainbow_eucalyptus",
        "title":"Награда за 60 уровень",
        "description":"Открыто легендарное растение Радужный эвкалипт",
    },
    {
        "level":65,
        "plant_code":"wise_oak",
        "title":"Награда за 65 уровень",
        "description":"Открыто легендарное растение Мудрый дуб",
    }
]

def seed_level_rewards(db: Session):
    for item in level_rewards_data:
        reward = db.query(LevelReward).filter(LevelReward.level == item["level"]).first()
        if reward:
            reward.plant_code = item["plant_code"]
            reward.title = item["title"]
            reward.description = item["description"]
        else:
            db.add(LevelReward(**item))
    db.commit()