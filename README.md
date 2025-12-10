# PixelType-DE - 10-Finger Typing Trainer

PixelType-DE is a browser-based 10-finger typing training web app using words. The app helps users practice typing as fast and accurately as possible. It is built with React and TypeScript (TSX) using Vite. The project also includes persistent highscore functionality, allowing multiple users on the same server to access the same ranking.

## Features ✨

- **10-Finger Typing Training** – Practice typing with all ten fingers using words to improve speed and accuracy.
- **Browser-Based** – Runs directly in the web browser with no additional client-side frameworks required.
- **Built with React + TypeScript (TSX) + Vite** – Modern web technologies for fast development and hot reloading.
- **Persistent Highscore** – Scores are saved on the server and remain after a server restart.
- **Hot Reloading** – Changes to TSX files update instantly in the browser.
- **Easy Installation & Autorun** – Windows (start.bat) and Linux (start.sh) scripts automatically check/install Node.js, install dependencies, and start the development server.
- **Production Build Ready** – Easily build and preview a production-ready version with `npm run build` and `npm run preview`.

## Quick Start and Installation 🚀

Run the provided autorun script depending on your system. The autorun scripts automatically check for Node.js, install dependencies, and start the development server.

### Windows Quick Start 💻
- Run the autorun script:
```powershell
start.bat
```
> This script automatically checks for Node.js, installs dependencies, and starts the development server.

### Windows Manual Installation 💻
- Install Node.js:
```powershell
winget install OpenJS.NodeJS.LTS
```
- Clone the repository:
```powershell
git clone <REPO_URL>
cd pixeltype
```
- Install dependencies:
```powershell
npm install
```
- Start the development server:
```powershell
npm run dev
```

### Linux Manual Installation 💻
- Install Node.js (LTS version):
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```
- Clone the repository:
```bash
git clone <REPO_URL>
cd pixeltype
```
- Install dependencies:
```bash
npm install
```
- Start the development server:
```bash
npm run dev
```

### Linux Quick Start 🚀
- Clone the repository:
```bash
git clone <REPO_URL>
cd pixeltype
```
- Make the autorun script executable:
```bash
chmod +x start.sh
```
- Run the autorun script:
```bash
./start.sh
```
> This autorun script automatically checks/installs Node.js, installs dependencies, and starts the development server in the project root folder.

## License

MIT License

Copyright (c) 2025 Blackrelirt

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

---

## Legal Credits for Google AI Studios

📄 This project uses templates and resources from [Google AI Studios](https://ai.google/studio). All original materials remain the property of Google. This repository is intended for **educational and non-commercial purposes only**.

