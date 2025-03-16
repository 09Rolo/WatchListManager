@echo off
title WatchListManager

cd %cd%

npm run start

echo.
echo.
echo -----Leállítás-----


ping localhost -n 2 >nul
exit