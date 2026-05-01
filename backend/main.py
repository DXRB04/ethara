from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, projects, tasks, dashboard

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ethara API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Ethara API"}
