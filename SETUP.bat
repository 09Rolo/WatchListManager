@echo off
SETLOCAL

echo ----------------------------------
echo 🚀 Setting up WatchlistManager...
echo ----------------------------------

where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Nincs Node.js
    exit /b
)

IF NOT EXIST package.json (
    echo ❌ nincs package.json
    exit /b
)

echo 📦 Kello dolgok letoltese...
npm install

IF NOT EXIST .env (
    echo 🌍 .env file letrehozasa
    echo PORT=999 > .env
)

echo 🚀 Szerver indítása...
npm start

echo ✅ Készen is volnánk
pause
