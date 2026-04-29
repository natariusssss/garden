from main import SessionLocal
from backend.models import Achievement

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