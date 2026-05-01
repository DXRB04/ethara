# Ethara Team Task Manager

Ethara is a premium, full-stack team task management application designed for professional collaboration. It provides users with the ability to create projects, manage team members, and track tasks using an intuitive Kanban-style board with drag-and-drop functionality.

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Distinct permissions for Project Admins and Members.
- **Project Management**: Create projects, edit details, and securely add/remove team members.
- **Kanban Board**: Interactive task tracking with drag-and-drop functionality across "To Do", "In Progress", "Review", and "Done" columns.
- **Task Management**: Assign tasks to users, set priorities, and establish due dates with a native calendar picker.
- **Dashboard Analytics**: High-level statistical overview of tasks across all your projects, including overdue task tracking.
- **Premium UI**: Custom, responsive glassmorphism design with a dark mode aesthetic and fluid animations.

## 🛠️ Technology Stack

- **Frontend**: 
  - React 18 + Vite
  - React Router v7
  - Axios (with JWT interceptors)
  - Lucide React (Icons)
  - Vanilla CSS (Glassmorphism & Flexbox/Grid layouts)
- **Backend**:
  - Python FastAPI
  - SQLAlchemy ORM
  - MySQL / PyMySQL (Database)
  - PyJWT & Passlib / bcrypt (Authentication)
  - Uvicorn (ASGI Server)

## 📦 Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MySQL Server

### 1. Database Setup
Create the MySQL database before starting the backend:
```sql
CREATE DATABASE ethara;
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python virtual environment:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

Start the FastAPI development server (this will automatically create the required database tables):
```bash
uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`. You can view the interactive API documentation at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🛡️ Security & Authentication

Ethara uses stateless JWT (JSON Web Tokens) for authentication. Tokens are stored securely and automatically attached to all outbound API requests via Axios interceptors. The backend enforces strict permission checks on all project and task manipulation routes.

## 📄 License
This project is proprietary and built for demonstration/internal purposes.
