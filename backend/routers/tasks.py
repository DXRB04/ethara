from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.task import TaskCreate, TaskUpdate, TaskResponse
from models.task import Task
from models.user import User
from middleware.auth import get_current_user
from services.rbac import check_project_member, check_project_admin

router = APIRouter()

@router.get("/", response_model=List[TaskResponse])
def get_tasks(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_project_member(db, project_id, current_user.id)
    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    return tasks

@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    check_project_member(db, task.project_id, current_user.id)
    new_task = Task(**task.model_dump(), created_by=current_user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/me", response_model=List[TaskResponse])
def get_my_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasks = db.query(Task).filter(Task.assignee_id == current_user.id).all()
    return tasks

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    # User can edit if they are admin, or if they are the assignee, or if they created it
    # Simplified check: is member
    member = check_project_member(db, task.project_id, current_user.id)
    
    if member.role != 'admin' and task.assignee_id != current_user.id and task.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this task")
        
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
        
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    check_project_admin(db, task.project_id, current_user.id)
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
