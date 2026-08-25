@echo off
title HireAI Backend
echo Starting HireAI Backend Service on port 8000...
cd backend
py -m uvicorn app.main:app --reload --port 8000
pause
