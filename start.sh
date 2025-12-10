#!/bin/bash

# ===========================================
# PixelType-DE Auto Start Script für Linux
# ===========================================

# Projekt-Root ist der Ordner, in dem das Skript liegt
PROJECT_ROOT="$(dirname "$(readlink -f "$0")")"
cd "$PROJECT_ROOT" || { echo "Projektordner nicht gefunden"; exit 1; }

# Prüfen, ob Node.js installiert ist
if ! command -v node &> /dev/null
then
    echo "Node.js ist nicht installiert. Installation über apt..."
    # Node.js LTS installieren
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Prüfen, ob npm verfügbar ist
if ! command -v npm &> /dev/null
then
    echo "Fehler: npm konnte nicht gefunden werden."
    exit 1
fi

echo "Node.js und npm sind installiert:"
node -v
npm -v

# npm Abhängigkeiten installieren
echo "Installiere npm Abhängigkeiten..."
npm install

# Development Server starten
echo "Starte Development Server..."
npm run dev
