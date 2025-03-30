@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo ----------------------------------------
echo Setting up WatchlistManager...
echo ----------------------------------------

:: Check if Node.js is installed
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Nincs Node.js
    exit /b
)

:: Check if dependencies are installed
IF EXIST node_modules (
    echo A hozza kello dolgok le vannak toltve
) ELSE (
    echo Hozza kello dolgok letoltese...
    npm install > setup.log 2>&1
)

:: Check if .env file exists
IF EXIST .env (
    echo .env file letezik
) ELSE (
    echo .env file letrehozasa
    echo PORT=999 > .env
)

:: Ask user before stopping the running server
tasklist | findstr /I "node.exe" >nul
IF %ERRORLEVEL% EQU 0 (
    set /p STOP_SERVER="Egy szerver mar fut. Szeretned leallitani? (i/n): "
    IF /I "!STOP_SERVER!"=="i" (
        echo A szerver leallitasa
        taskkill /IM node.exe /F >nul
    ) ELSE (
        echo A szerver nem állt le, lehet hogy latsz majd "port already in use" errorokat.
    )
)

:: Ask user how to start the server
set /p START_OPTION="Szerver inditasa uj ablakba (i/n)?: "
IF /I "!START_OPTION!"=="i" (
    start "" cmd /k npm start
) ELSE (
    npm start
)

echo Keszen is volnank!
pause


