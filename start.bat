@echo off
echo ====================================
echo    FirewallAI - Interface Demo
echo ====================================
echo.
echo Installation des dependances...
call npm install
echo.
echo Demarrage de l'application...
echo L'interface sera accessible sur: http://localhost:5000
echo.
echo Compte de test:
echo   Email: root@root.fr
echo   Mot de passe: root
echo.
echo Appuyez sur Ctrl+C pour arreter l'application
echo.
call npm run dev
pause