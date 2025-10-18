@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo ----------------------------------------
echo Setting up WatchlistManager...
echo ----------------------------------------

:: Check if Node.js is installed
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Nincs Node.js
    pause
    exit
)



:: Try to detect MySQL path (commonly installed under Program Files)
IF NOT DEFINED MYSQL_PATH (
    for %%D in (
        "C:\xampp\mysql\bin"
        "D:\xampp\mysql\bin"
        "C:\Program Files\MySQL\MySQL Server 8.0\bin"
        "C:\Program Files\MySQL\MySQL Server 5.7\bin"
        "C:\Program Files (x86)\MySQL\MySQL Server 5.7\bin"
        "D:\Program Files\MySQL\MySQL Server 8.0\bin"
    ) do (
        if exist "%%~D\mysqldump.exe" (
            set "MYSQL_PATH=%%~D"
            goto :found_mysql
        )
    )
)

:found_mysql
IF DEFINED MYSQL_PATH (
    echo MySQL megtalalva es hozzaadva a PATH-hoz: !MYSQL_PATH!
    set "PATH=!MYSQL_PATH!;%PATH%"
) ELSE (
    echo [Figyelmeztetes] Nem talaltam meg a MySQL bin konyvtarat. Ha a mysqldump parancs nem fog mukodni, add hozza a PATH-hoz.
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


echo.
echo A 80as es a 443as portok legyenek majd kinyitva a tuzfalnal
echo.

echo A win-acme-t toltsd le, setupold fel
echo.
echo Stoppold a szervert ha fut
echo.
echo M
echo 2 Manual Input
echo wlm.kissroland.hu
echo Enter
echo 4 Single Certificate
echo 2 Server verification files from memory
echo 2 RSA key
echo Fontos, 2 PEM encoded files
echo Ide a path, macskakorom nelkul, ahova mentse a pem fileokat
echo 1 None
echo 5 No additional store steps
echo 3 No additional installation steps
echo.

start "" https://www.win-acme.com/



:: Ask user before stopping the running server
tasklist | findstr /I "node.exe" >nul
IF %ERRORLEVEL% EQU 0 (
    set /p STOP_SERVER="Egy szerver mar fut. Szeretned leallitani? (i/n): "
    IF /I "!STOP_SERVER!"=="i" (
        echo A szerver leallitasa
        taskkill /IM node.exe /F >nul
    ) ELSE (
        echo A szerver nem allt le, lehet hogy latsz majd "port already in use" errorokat.
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


