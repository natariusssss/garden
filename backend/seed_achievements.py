import code
from main import SessionLocal
from backend.models import Achievement
from sqlalchemy.orm import Session
from models import Achievement, AchievementReward
def seed_achievements():
    db = SessionLocal()
    achievements_data=[
        {
            "code": "first_review",
            "title": "Первый шаг",
            "description": "Сделать первое повторение",
            "icon_url": None,
            "condition_type": "reviews_count",
            "condition_value": 1,
        },
        {
            "code": "reviews_10",
            "title": "10 повторений",
            "description": "Сделать 10 повторений",
            "icon_url": None,
            "condition_type": "reviews_count",
            "condition_value": 10,
        },
        {
            "code": "xp_100",
            "title": "100 XP",
            "description": "Набрать 100 XP",
            "icon_url": None,
            "condition_type": "total_xp",
            "condition_value": 100,
        },
        {
            "code": "first_topic",
            "title": "Первая тема",
            "description": "Создать первую тему",
            "icon_url": None,
            "condition_type": "topics_count",
            "condition_value": 1,
        },
        {
            "code": "fifth_topic",
            "title": "Пятая тема",
            "description": "Создать пятую тему",
            "icon_url": None,
            "condition_type": "topics_count",
            "condition_value": 5,
        },
        {
            "code": "xp_1000",
            "title": "1000 XP",
            "description": "Набрать 1000 XP",
            "icon_url": None,
            "condition_type": "total_xp",
            "condition_value": 1000,
        },
        {
            "code": "first_friend",
            "title": "Первый друг",
            "description": "Добавить первого друга",
            "icon_url": None,
            "condition_type": "friends_count",
            "condition_value": 1,
        },
        {
            "code": "fifth_friend",
            "title": "Пять друзей",
            "description": "Добавить пять друзей",
            "icon_url": None,
            "condition_type": "friends_count",
            "condition_value": 5,
        },
        {
            "code": "fifth_level",
            "title": "Пятый уровень",
            "description": "Достичь пятого уровня",
            "icon_url": None,
            "condition_type": "level",
            "condition_value": 5,
        },
        {
            "code": "seven_days_streak",
            "title": "7 дней подряд",
            "description": "Заниматься 7 дней подряд",
            "icon_url": None,
            "condition_type": "days_streak",
            "condition_value": 7
        }
    ]
    try:
        for item in achievements_data:
            exists=db.query(Achievement).filter(Achievement.code==item["code"]).first()
            if not exists:
                achievement=Achievement(**item)
                db.add(achievement)
        db.commit()
    except Exception as e:
        db.rollback()
        print("Error:", e)
    finally:
        db.close()
if __name__ == "__main__":
    seed_achievements()