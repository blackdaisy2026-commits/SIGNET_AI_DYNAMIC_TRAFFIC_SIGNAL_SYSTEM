@echo off
cd /d "%~dp0"
echo Starting Backend Server...
uvicorn app.main:app --reload --port 8000
pause
