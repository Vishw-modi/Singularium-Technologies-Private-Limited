from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from datetime import datetime, date
from dotenv import load_dotenv
from supabase import create_client, Client

import os
import uuid


# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)


# --------------------
# ANALYZE TASKS ENDPOINT
# --------------------
@api_view(["POST"])
def analyze_tasks(request):
    tasks = request.data.get("tasks", [])
    strategy = request.data.get("strategy", "smart_balance")

    if not tasks:
        return Response({"error": "Tasks list is required"}, status=400)

    scored = [score_task(t, tasks, strategy) for t in tasks]
    scored.sort(key=lambda x: x["score"], reverse=True)

    return Response({"tasks": scored, "strategy": strategy})


# --------------------
# VALIDATION + SCORING HELPERS
# --------------------
def validate_task(task):
    return {
        "id": task.get("id") or str(uuid.uuid4()),
        "title": task.get("title", "Untitled Task"),
        "due_date": task.get("due_date", str(date.today())),
        "estimated_hours": max(1, task.get("estimated_hours", 1)),
        "importance": min(10, max(1, task.get("importance", 5))),
        "dependencies": task.get("dependencies", []),
    }


def get_days_until_due(due):
    due = datetime.strptime(due, "%Y-%m-%d").date()
    today = date.today()
    return (due - today).days


def calculate_urgency_score(due_date):
    d = get_days_until_due(due_date)
    if d < 0: return 10 + min(5, abs(d) * 0.5)
    if d == 0: return 10
    if d == 1: return 9
    if d <= 3: return 8
    if d <= 7: return 6
    if d <= 14: return 4
    if d <= 30: return 2
    return 1


def calculate_effort_score(h):
    if h <= 1: return 10
    if h <= 2: return 8
    if h <= 4: return 6
    if h <= 8: return 4
    if h <= 16: return 2
    return 1


def calculate_dependency_score(task_id, tasks):
    count = sum(1 for t in tasks if task_id in t.get("dependencies", []))
    if count == 0: return 1
    if count == 1: return 4
    if count == 2: return 7
    return 10


def score_task(task, all_tasks, strategy):
    t = validate_task(task)

    urgency = calculate_urgency_score(t["due_date"])
    importance = t["importance"]
    effort = calculate_effort_score(t["estimated_hours"])
    dependency = calculate_dependency_score(t["id"], all_tasks)

    # Strategy logic
    if strategy == "fastest_wins":
        score = effort * 4 + importance * 1.5 + urgency * 1
    elif strategy == "high_impact":
        score = importance * 4 + urgency * 1.5 + dependency * 1.5
    elif strategy == "deadline_driven":
        score = urgency * 4 + importance * 1.5 + dependency * 1
    else:  # smart_balance
        score = urgency * 2.5 + importance * 2 + effort * 1.5 + dependency * 2

    score = round(score, 1)

    priority = "high" if score >= 25 else "medium" if score >= 15 else "low"

    explanation = f"Score computed with {strategy} strategy."

    return { **t, "score": score, "priority": priority, "explanation": explanation }


# --------------------
# SUGGEST TASKS ENDPOINT
# --------------------
@api_view(["GET"])
def suggest_tasks(request):
    # Fetch tasks from Supabase
    result = supabase.table("tasks").select("*").order("created_at", desc=True).execute()
    tasks = result.data

    if not tasks:
        return Response({
            "suggestions": [],
            "message": "No tasks found"
        })

    # Analyze
    analyzed = [score_task(t, tasks, "smart_balance") for t in tasks]
    analyzed.sort(key=lambda x: x["score"], reverse=True)

    return Response({
        "suggestions": analyzed[:3],
        "total_tasks": len(tasks)
    })
