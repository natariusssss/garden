from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    total_xp = Column(Integer, default=0)
    description = Column(Text, nullable=True)

    user_topics = relationship("UserTopic", back_populates="user")
    review_history = relationship("ReviewHistory", back_populates="user")
    topics = relationship("Topic", back_populates="user")
    user_achievements = relationship("UserAchievement", back_populates="user")
    plants = relationship("UserPlant", back_populates="user")
    level_rewards = relationship("UserLevelReward", back_populates="user")

    friendships_sent = relationship("Friendship",
        foreign_keys="Friendship.user_id",
        back_populates="user",
    )
    friendships_received = relationship(
        "Friendship",
        foreign_keys="Friendship.friend_id",
        back_populates="friend",
    )

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(50), nullable=False)
    description = Column(Text)
    tree_type=Column(String(50), nullable=False)
    rarity=Column(String(50), nullable=False)
    image_url=Column(Text, nullable=False)

    user = relationship("User", back_populates="topics")
    user_topics = relationship("UserTopic", back_populates="topic")
    review_history = relationship("ReviewHistory", back_populates="topic")


class UserTopic(Base):
    __tablename__ = "user_topics"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    level = Column(Integer, nullable=False, default=0)
    last_reviewed = Column(DateTime, default=datetime.now)
    review_count = Column(Integer, default=0, nullable=False)
    next_review_date = Column(DateTime, default=datetime.now)
    last_xp_penalty_at = Column(DateTime, nullable=True)
    xp = Column(Integer, default=0)
    tree_state=Column(String(50), nullable=False, default="seed")

    user = relationship("User", back_populates="user_topics")
    topic = relationship("Topic", back_populates="user_topics")


class ReviewHistory(Base):
    __tablename__ = "review_history"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    reviewed_at = Column(DateTime, default=datetime.now, nullable=False)
    success = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="review_history")
    topic = relationship("Topic", back_populates="review_history")


class Friendship(Base):
    __tablename__ = "friendship"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    friend_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.now)

    user = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="friendships_sent",
    )
    friend = relationship(
        "User",
        foreign_keys=[friend_id],
        back_populates="friendships_received",
    )


class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True)
    title = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    icon_url=Column(Text, nullable=False)
    condition_type=Column(String(50), nullable=False)
    condition_value=Column(Integer, nullable=False)
    code=Column(String(50), unique=True, nullable=False)

    user_achievements = relationship("UserAchievement", back_populates="achievement")
    rewards = relationship("AchievementReward", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.now)

    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")


class AchievementReward(Base):
    __tablename__ = "achievement_rewards"
    id = Column(Integer, primary_key=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    reward_type = Column(String(50), nullable=False)
    reward_value = Column(String(100), nullable=False)

    achievement = relationship("Achievement", back_populates="rewards")

class Plant(Base):
    __tablename__ = "plants"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    rarity = Column(String, nullable=False)
    tree_type = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

    user_plants = relationship("UserPlant", back_populates="plant")

class UserPlant(Base):
    __tablename__ = "user_plants"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plant_code = Column(String, ForeignKey("plants.code"), nullable=False)
    source_achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=True)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint("user_id", "plant_code", name="uq_user_plant"),)

    user=relationship("User", back_populates="plants")
    plant = relationship("Plant", back_populates="user_plants")

class LevelReward(Base):
    __tablename__ = "level_rewards"
    id = Column(Integer, primary_key=True, index=True)
    level = Column(Integer, unique=True, nullable=False)
    plant_code = Column(String, ForeignKey("plants.code"), nullable=False)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)

    plant = relationship("Plant")
    user_level_rewards = relationship("UserLevelReward", back_populates="level_reward")

class UserLevelReward(Base):
    __tablename__ = "user_level_rewards"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    level_reward_id = Column(Integer, ForeignKey("level_rewards.id"), nullable=False)
    received_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="level_rewards")
    level_reward = relationship("LevelReward", back_populates="user_level_rewards")
    __table_args__ = (
        UniqueConstraint("user_id", "level_reward_id", name="uq_user_level_reward"),
    )



