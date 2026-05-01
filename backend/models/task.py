from sqlalchemy import Column, Integer, String, Text, Enum, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    status = Column(Enum('todo', 'in-progress', 'review', 'done', name='task_status'), default='todo')
    priority = Column(Enum('low', 'medium', 'high', 'urgent', name='task_priority'), default='medium')
    due_date = Column(Date, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", foreign_keys=[assignee_id], back_populates="tasks_assigned")
    creator = relationship("User", foreign_keys=[created_by], back_populates="tasks_created")
