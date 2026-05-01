from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.project import ProjectCreate, ProjectResponse, ProjectDetailResponse, ProjectMemberAdd
from models.project import Project, ProjectMember
from models.user import User
from middleware.auth import get_current_user
from services.rbac import check_project_member, check_project_admin

router = APIRouter()

@router.get("/", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).join(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()
    return projects

@router.post("/", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_project = Project(**project.model_dump(), owner_id=current_user.id)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    # Add creator as admin member
    member = ProjectMember(project_id=new_project.id, user_id=current_user.id, role='admin')
    db.add(member)
    db.commit()
    
    return new_project

@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_project_member(db, project_id, current_user.id)
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_project_admin(db, project_id, current_user.id)
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

@router.post("/{project_id}/members")
def add_member(project_id: int, member_data: ProjectMemberAdd, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_project_admin(db, project_id, current_user.id)
    
    user_to_add = db.query(User).filter(User.email == member_data.email).first()
    if not user_to_add:
        raise HTTPException(status_code=404, detail="User with email not found")
        
    existing_member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_to_add.id
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a member")
        
    new_member = ProjectMember(project_id=project_id, user_id=user_to_add.id, role=member_data.role)
    db.add(new_member)
    db.commit()
    return {"message": "Member added successfully"}
