@echo off
echo ========================================
echo QuickClaim Chatbot - MERN Stack
echo ========================================
echo.

echo [1/2] Starting Backend Server...
cd chatbot-backend
start cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Dev Server...
cd ..\chatbot-frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:3002
echo ========================================
echo.
echo Press any key to exit...
pause >nul
