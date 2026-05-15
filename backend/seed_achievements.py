from sqlalchemy.orm import Session
from models import Achievement, AchievementReward
achievements_data = [
    {
        "code": "first_review",
        "title": "Первый шаг",
        "description": "Сделать первое повторение",
        "icon_url": "",
        "condition_type": "reviews_count",
        "condition_value": 1,
        "rewards": [{"type": "xp", "value": 25},{"type": "plant", "value": "baobab"},],
    },
    {
        "code": "reviews_10",
        "title": "10 повторений",
        "description": "Сделать 10 повторений",
        "icon_url": "",
        "condition_type": "reviews_count",
        "condition_value": 10,
        "rewards": [{"type": "xp", "value": 50}, {"type": "plant", "value": "hydrangea"},],
    },
    {
        "code": "xp_100",
        "title": "100 XP",
        "description": "Набрать 100 XP",
        "icon_url": "",
        "condition_type": "total_xp",
        "condition_value": 100,
        "rewards": [{"type": "plant", "value": "orchid"},],
    },
    {
        "code": "first_topic",
        "title": "Первая тема",
        "description": "Создать первую тему",
        "icon_url": "",
        "condition_type": "topics_count",
        "condition_value": 1,
        "rewards": [{"type": "plant", "value": "swamp_cypress"},],
    },
    {
        "code": "fifth_topic",
        "title": "Пятая тема",
        "description": "Создать пятую тему",
        "icon_url": "",
        "condition_type": "topics_count",
        "condition_value": 5,
        "rewards": [{"type": "xp", "value": 50}, {"type": "plant", "value": "maple_japan"},],
    },
    {
        "code": "xp_1000",
        "title": "1000 XP",
        "description": "Набрать 1000 XP",
        "icon_url": "",
        "condition_type": "total_xp",
        "condition_value": 1000,
        "rewards": [{"type": "xp", "value": 100}],
    },
    {
        "code": "first_friend",
        "title": "Первый друг",
        "description": "Добавить первого друга",
        "icon_url": "",
        "condition_type": "friends_count",
        "condition_value": 1,
        "rewards": [{"type": "xp", "value": 25}, {"type": "plant", "value": "ginkgo"},],
    },
    {
        "code": "fifth_friend",
        "title": "Пять друзей",
        "description": "Добавить пять друзей",
        "icon_url": "",
        "condition_type": "friends_count",
        "condition_value": 5,
        "rewards": [{"type": "xp", "value": 50}, {"type": "plant", "value": "lilac"},],
    },
    {
        "code": "fifth_level",
        "title": "Пятый уровень",
        "description": "Достичь пятого уровня",
        "icon_url": "",
        "condition_type": "level",
        "condition_value": 5,
        "rewards": [{"type": "xp", "value": 50}],
    },
    {
        "code": "seven_days_streak",
        "title": "7 дней подряд",
        "description": "Заниматься 7 дней подряд",
        "icon_url": "",
        "condition_type": "days_streak",
        "condition_value": 7,
        "rewards": [{"type": "xp", "value": 100}, {"type": "plant", "value": "jacaranda"},],
    },
    {
        "code": "xp_50",
        "title": "Первые 50 XP",
        "description": "Набрать 50 XP",
        "icon_url": "",
        "condition_type": "total_xp",
        "condition_value": 50,
        "rewards": [{"type": "xp", "value": 15}],
    },
    {
        "code": "reviews_5",
        "title": "5 повторений",
        "description": "Сделать 5 повторений",
        "icon_url": "",
        "condition_type": "reviews_count",
        "condition_value": 5,
        "rewards": [{"type": "xp", "value": 30}],
    },
    {
        "code": "days_streak_3",
        "title": "3 дня подряд",
        "description": "Заниматься 3 дня подряд",
        "icon_url": "",
        "condition_type": "days_streak",
        "condition_value": 3,
        "rewards": [{"type": "xp", "value": 40}],
    },
    
]

def seed_achievements(db: Session):
    try:
        for item in achievements_data:
            rewards = item["rewards"]
            achievement = db.query(Achievement).filter(Achievement.code == item["code"]).first()
            if achievement:
                achievement.title = item["title"]
                achievement.description = item["description"]
                achievement.icon_url = item["icon_url"]
                achievement.condition_type = item["condition_type"]
                achievement.condition_value = item["condition_value"]
            else:
                achievement = Achievement(
                    code=item["code"],
                    title=item["title"],
                    description=item["description"],
                    icon_url=item["icon_url"],
                    condition_type=item["condition_type"],
                    condition_value=item["condition_value"],
                )
                db.add(achievement)
                db.flush()
            db.query(AchievementReward).filter(AchievementReward.achievement_id == achievement.id).delete()
            for reward in rewards:
                achievement_reward = AchievementReward(
                    achievement_id=achievement.id,
                    reward_type=reward["type"],
                    reward_value=str(reward["value"]),
                )
                db.add(achievement_reward)
        db.commit()
    except Exception as e:
        db.rollback()
        print("Error while seeding achievements:", e)
