from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..models.project import ProjectMember
from ..models.user import User

def check_project_member(db: Session, project_id: int, user_id: int):
    member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of this project")
    return member

def check_project_admin(db: Session, project_id: int, user_id: int):
    member = check_project_member(db, project_id, user_id)
    if member.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return member
