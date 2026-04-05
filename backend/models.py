from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
from datetime import datetime

Base=declarative_base()
class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username=Column(String(50), nullable=False, unique=True)
    email = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    user_topics=relationship("UserTopic", back_populates="user")
    review_history=relationship("ReviewHistory", back_populates="user")
    topics=relationship("Topic", back_populates="user")
    categories = relationship("Category", back_populates="user")


class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    name=Column(String(50), nullable=False, unique=True)
    description=Column(Text)
    user = relationship("User", back_populates="categories")
    topics=relationship("Topic", back_populates="category")


class Topic(Base):
    __tablename__ = 'topics'
    id = Column(Integer, primary_key=True)
    user_id=Column(Integer, ForeignKey('user.id'), nullable=False)
    category_id=Column(Integer, ForeignKey('categories.id'))
    name=Column(String(50), nullable=False)
    description=Column(Text)
    user=relationship("User", back_populates="topics")
    category=relationship("Category", back_populates="topics")
    user_topics=relationship("UserTopic", back_populates="topics")
    review_history=relationship("ReviewHistory", back_populates="topics")


class UserTopic(Base):
    __tablename__ = 'user_topics'
    id = Column(Integer, primary_key=True)
    user_id=Column(Integer, ForeignKey('user.id'))
    topic_id=Column(Integer, ForeignKey('topics.id'))
    level=Column(Integer, nullable=False, default=0)
    last_reviewed = Column(DateTime, default=datetime.now)
    review_count = Column(Integer, default=0, nullable=False)
    next_review_date = Column(DateTime, default=datetime.now)
    user=relationship("User", back_populates="user_topics")
    topic=relationship("Topic", back_populates="user_topics")


class ReviewHistory(Base):
    __tablename__ = 'review_history'
    id = Column(Integer, primary_key=True)
    user_id=Column(Integer, ForeignKey('user.id'))
    topic_id=Column(Integer, ForeignKey('topics.id'))
    reviewed_at=Column(DateTime, default=datetime.now, nullable=False)
    success=Column(Boolean, default=False, nullable=False)
    user=relationship("User", back_populates="review_history")
    topic=relationship("Topic", back_populates="review_history")
