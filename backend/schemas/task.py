from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = 'todo'
    priority: str = 'medium'
    due_date: Optional[date] = None
    assignee_id: Optional[int] = None

class TaskCreate(TaskBase):
    project_id: int

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[date] = None
    assignee_id: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    project_id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
