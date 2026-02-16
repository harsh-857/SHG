@echo off
echo ==================================================
echo Muzaffarnagar SHG Service Exchange - Launcher
echo ==================================================

:: Check if Server node_modules exists
if not exist "server\node_modules" (
    echo [INFO] Server dependencies not found. Installing...
    cd server
    call npm install
    cd ..
)

:: Check if Client node_modules exists
if not exist "client\node_modules" (
    echo [INFO] Client dependencies not found. Installing...
    cd client
    call npm install
    cd ..
)

echo.
echo [INFO] Starting Backend Server...
start "SHG Backend (Port 5000)" cmd /k "cd server && npm start"

echo [INFO] Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo [INFO] Starting Frontend Client...
start "SHG Client (Port 5173)" cmd /k "cd client && npm run dev"

echo.
echo [SUCCESS] Application launched!
echo Please check the opened windows for logs.
echo You can minimize this window but do not close the others.
pause
