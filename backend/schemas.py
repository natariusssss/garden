from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime
    class Config:
        from_attributes=True
class CategoryBase(BaseModel):
    name: str
    description: Optional[str]=None
class CategoryCreate(CategoryBase):
    pass
class CategoryUpdate(CategoryBase):
    name: Optional[str]=None
class CategoryResponse(CategoryBase):
    user_id: int
    id: int
    class Config:
        from_attributes=True
class TopicBase(BaseModel):
    name: str
    description: Optional[str]=None
    category_id: int
class TopicResponse(TopicBase):
    id: int
    user_id: int
    category: Optional[CategoryResponse]=None
    class Config:
        from_attributes=True
class TopicCreate(TopicBase):
    pass
class TopicUpdate(TopicBase):
    name: Optional[str]=None
    description: Optional[str]=None
    category_id: Optional[int]=None
class UserTopicCreate(BaseModel):
    topic_id: int
    level: Optional[int]=0
class UserTopicResponse(BaseModel):
    id: int
    user_id: int
    topic_id: int
    level: int
    review_count: int
    last_reviewed: Optional[datetime]=None
    next_review_date: Optional[datetime]=None
    class Config:
        from_attributes=True
class ReviewHistoryCreate(BaseModel):
    topic_id: int
    success: bool
class ReviewHistoryResponse(BaseModel):
    id: int
    topic_id: int
    reviewed_at: datetime
    success: bool
    xp_earned: int
    next_level: int
    class Config:
        from_attributes=True
class Token(BaseModel):
    access_token: str
    token_type: str




