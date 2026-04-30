from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from ..database import get_db
from ..models.task import Task
from ..models.project import Project, ProjectMember
from ..models.user import User
from ..middleware.auth import get_current_user

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Get all projects the user is a member of
    user_projects = db.query(Project.id).join(ProjectMember).filter(ProjectMember.user_id == current_user.id).subquery()
    
    # Total tasks across all these projects
    total_tasks = db.query(Task).filter(Task.project_id.in_(user_projects)).count()
    
    # Tasks assigned to user
    my_tasks = db.query(Task).filter(Task.assignee_id == current_user.id).count()
    
    # Overdue tasks
    overdue_tasks = db.query(Task).filter(
        Task.project_id.in_(user_projects),
        Task.due_date < date.today(),
        Task.status != 'done'
    ).count()
    
    # Tasks by status
    status_counts = db.query(Task.status, func.count(Task.id)).filter(
        Task.project_id.in_(user_projects)
    ).group_by(Task.status).all()
    
    status_dict = {status: count for status, count in status_counts}
    
    return {
        "total_tasks": total_tasks,
        "my_tasks": my_tasks,
        "overdue_tasks": overdue_tasks,
        "by_status": status_dict
    }
