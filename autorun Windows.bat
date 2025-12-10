@echo off
REM ===========================================
REM PixelType-DE Auto Start Script
REM ===========================================

REM Projekt-Root ist der Ordner, in dem diese Batch-Datei liegt
SET "PROJECT_ROOT=%~dp0"
cd /d "%PROJECT_ROOT%"

REM Prüfen, ob Node.js installiert ist
node -v >nul 2>&1
IF ERRORLEVEL 1 (
    echo Node.js ist nicht installiert. Installation ueber winget...
    winget install OpenJS.NodeJS.LTS -e --silent
    IF ERRORLEVEL 1 (
        echo Fehler: Node.js konnte nicht installiert werden.
        pause
        exit /b 1
    )
    REM Node.js nach Installation dem PATH hinzufügen
    set "PATH=%PATH%;C:\Program Files\nodejs"
) ELSE (
    echo Node.js ist bereits installiert.
)

REM npm Abhängigkeiten installieren
echo Installiere npm Abhaengigkeiten...
call npm install

REM Development Server starten
echo Starte Development Server...
call npm run dev

pause
