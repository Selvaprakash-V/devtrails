@echo off
echo Starting QuickClaim Services...
echo.

echo [1/3] Starting ML Service on port 8000...
start "ML Service" cmd /k "cd ml && python api/main.py"
timeout /t 3 /nobreak > nul

echo [2/3] Starting API Server on port 5000...
start "API Server" cmd /k "cd services\api-server && npm run dev"
timeout /t 3 /nobreak > nul

echo [3/3] Starting Worker App on port 3000...
start "Worker App" cmd /k "cd apps\worker-app && npm run dev"

echo.
echo All services started!
echo.
echo ML Service: http://localhost:8000
echo API Server: http://localhost:5000
echo Worker App: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
