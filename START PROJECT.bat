@echo off
title KedaiKas

echo ==========================================
echo               KEDAIKAS
echo ==========================================
echo.

echo [1/2] Starting Backend FastAPI...
start "KedaiKas Backend - FastAPI" cmd /k "cd /d C:\Users\LOQ\Documents\Project mandiri\umkm-decision-support\backend && python -m uvicorn app.main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Next.js...
start "KedaiKas Frontend - Next.js" cmd /k "cd /d C:\Users\LOQ\Documents\Project mandiri\umkm-decision-support\frontend && npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo.
echo Project started.
echo Frontend: http://localhost:3000
echo Backend : http://localhost:8000
echo.

start http://localhost:3000

pause