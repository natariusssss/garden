from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
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

    user_topics = relationship("UserTopic", back_populates="user")
    review_history = relationship("ReviewHistory", back_populates="user")
    topics = relationship("Topic", back_populates="user")
    categories = relationship("Category", back_populates="user")

    friendships_sent = relationship("Friendship",
        foreign_keys="Friendship.user_id",
        back_populates="user",
    )
    friendships_received = relationship(
        "Friendship",
        foreign_keys="Friendship.friend_id",
        back_populates="friend",
    )


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(Text)

    user = relationship("User", back_populates="categories")
    topics = relationship("Topic", back_populates="category")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    name = Column(String(50), nullable=False)
    description = Column(Text)
    tree_type=Column(String(50), nullable=False)
    rarity=Column(String(50), nullable=False)
    image_url=Column(Text, nullable=False)

    user = relationship("User", back_populates="topics")
    category = relationship("Category", back_populates="topics")
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

