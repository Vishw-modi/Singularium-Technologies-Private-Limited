# Smart Task Analyzer  
### Assignment Submission – Singularium Technologies Private Limited

Smart Task Analyzer is a structured task-prioritization system that scores and ranks tasks based on urgency, importance, effort, and dependencies.  
It consists of:

- A **React + Vite frontend**  
- A **Django backend**  
- **Supabase (PostgreSQL)** as the database

Users can add tasks, bulk import them, analyze task priority using multiple strategies, and view the top recommended tasks.

---

# 📌 Features

### ✔ Add Tasks  
Each task has:
- Title  
- Due date  
- Estimated hours  
- Importance (1–10)  
- Dependencies  

### ✔ Bulk Import  
Paste a JSON array to add many tasks at once.

### ✔ Multiple Prioritization Strategies  
- **Smart Balance** (default)  
- **Fastest Wins**  
- **High Impact**  
- **Deadline Driven**

### ✔ Top Suggestions  
Returns the 3 most important tasks to focus on next.

### ✔ Database Integration  
Tasks are stored in **Supabase** and fetched by both frontend and backend.

---

# 🏗️ Project Structure

project-root/
│
├── task_backend/ # Django backend
│ ├── tasks/ # Task scoring + Suggestion API
│ ├── core/ # Django project settings
│ ├── venv/ # Python virtual environment
│ ├── manage.py
│ └── requirements.txt
│
└── frontend/ # React + Vite frontend
├── src/
├── public/
├── index.html
└── package.json

yaml
Copy code

---

# 🚀 Getting Started
## 1. Clone the repository
```bash
git clone <repository-url>
cd <project-folder>


🐍 BACKEND SETUP (Django + Supabase)
2. Create and activate virtual environment
bash
Copy code
cd task_backend
python -m venv venv
source venv/Scripts/activate   # For Git Bash on Windows
3. Install backend dependencies
bash
Copy code
pip install -r requirements.txt
If you need to recreate requirements.txt:
bash
Copy code
pip freeze > requirements.txt
4. Create .env file inside task_backend/
Add your Supabase credentials:

ini
Copy code
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
These are required for task fetching and suggestion analysis.

5. Apply migrations
bash
Copy code
python manage.py migrate
6. Run backend server
bash
Copy code
python manage.py runserver
Backend URL:

cpp
Copy code
http://127.0.0.1:8000
🧠 Backend API Endpoints
1. Analyze Tasks
bash
Copy code
POST /api/analyze-tasks/
Request Body:

json
Copy code
{
  "strategy": "smart_balance",
  "tasks": [
    {
      "title": "Example Task",
      "due_date": "2025-12-31",
      "estimated_hours": 4,
      "importance": 8,
      "dependencies": []
    }
  ]
}
2. Get Suggestions
bash
Copy code
GET /api/suggest-tasks/
Returns:

Top 3 recommended tasks

Total task count

🖥️ FRONTEND SETUP (React + Vite)
1. Navigate to frontend folder
bash
Copy code
cd frontend
2. Install dependencies
bash
Copy code
npm install
3. Start development server
bash
Copy code
npm run dev
Frontend URL:

arduino
Copy code
http://localhost:8080
🔗 Frontend–Backend Integration
Frontend does:

Inserts tasks → Supabase directly

Sends requests → Django backend

/api/analyze-tasks/

/api/suggest-tasks/

Backend:

Reads tasks from Supabase

Scores tasks

Returns results

Sends task suggestions

CORS is fully configured in Django.

🧮 Task Scoring Logic (Summary)
Each task is evaluated based on:

Urgency
How many days remain before due date

Importance
Provided by user (1–10)

Effort
Lower effort may rank higher (depending on strategy)

Dependency Score
Tasks that unblock other tasks get a higher score

Strategies apply different weights to these components.

🛠️ Technologies Used
Backend
Django

Django REST Framework

Supabase Python Client

python-dotenv

django-cors-headers

httpx

Frontend
React

Vite

TypeScript

TailwindCSS

shadcn/ui

Supabase JS Client

Database
Supabase (PostgreSQL)

📄 Notes
This project is built specifically as an assignment submission for Singularium Technologies Private Limited.
The goal is to demonstrate full-stack development skills, API design, scoring logic, and structured system design.

🙌 Thank You
If you have any questions or need a walkthrough, feel free to contact me.
Happy to explain design choices or architecture in detail.
