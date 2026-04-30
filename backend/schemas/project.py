from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = 'active'

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class ProjectMemberBase(BaseModel):
    user_id: int
    role: str

class ProjectMemberResponse(ProjectMemberBase):
    id: int
    project_id: int
    joined_at: datetime

    class Config:
        from_attributes = True

class ProjectMemberAdd(BaseModel):
    email: str
    role: str = 'member'

class ProjectDetailResponse(ProjectResponse):
    members: List[ProjectMemberResponse] = []

    class Config:
        from_attributes = True
