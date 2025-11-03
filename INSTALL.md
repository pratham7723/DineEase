# 🚀 Installation Guide - DineEase

## Quick Start for Demo Mode (No Backend Required!)

This guide will help you set up DineEase in **DEMO MODE** - the easiest way to get started!

### ✅ Prerequisites

1. **Node.js** (v18.0.0 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Run the installer and follow the steps
   - Restart your terminal/PowerShell after installation

2. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/downloads
   - Or use GitHub Desktop: https://desktop.github.com/

### 📥 Step 1: Clone the Repository

Open your terminal/PowerShell and run:

```bash
git clone https://github.com/pratham7723/DineEase.git
cd DineEase
```

### 📦 Step 2: Install Dependencies

```bash
cd client
npm install
```

**This will take 2-5 minutes depending on your internet speed.**

Wait for the installation to complete. You'll see:
```
added 1234 packages in 2m
```

### ▶️ Step 3: Run the Application

```bash
npm run dev
```

The app will start automatically and open in your browser at:
**http://localhost:5173**

### 🔑 Step 4: Login

Use any of these demo credentials (click on them in the login page):

**Demo Accounts:**
- **Owner**: owner@dineease.com / owner123
- **Manager**: manager@dineease.com / manager123
- **Waiter**: waiter@dineease.com / waiter123
- **Chef**: chef@dineease.com / chef123

### 🎉 You're Done!

That's it! The app is running with demo data. No backend or database needed!

---

## Troubleshooting

### ❌ Error: 'vite' is not recognized

**Problem**: Dependencies are not installed.

**Solution**:
```bash
# Make sure you're in the client directory
cd client

# Check if node_modules exists
dir node_modules

# If node_modules doesn't exist, run:
npm install
```

### ❌ Error: 'npm' is not recognized

**Problem**: Node.js is not installed or not in PATH.

**Solution**:
1. Download and install Node.js from https://nodejs.org/
2. Choose the LTS version
3. During installation, make sure to check "Add to PATH"
4. Restart your terminal/PowerShell
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### ❌ Error: Port 5173 is already in use

**Problem**: Another app is using port 5173.

**Solution**:
1. Kill the process using the port:
   - Windows PowerShell:
     ```powershell
     netstat -ano | findstr :5173
     taskkill /PID <PID_NUMBER> /F
     ```
   - Or simply restart your computer

### ❌ Error: npm ERR! code ELIFECYCLE

**Problem**: Corrupted installation or network issue.

**Solution**:
```bash
# Clean install
cd client
rmdir /s node_modules  # Windows
del package-lock.json
npm cache clean --force
npm install
```

### ❌ Error: Missing dependencies

**Problem**: Some packages failed to install.

**Solution**:
```bash
cd client
npm install --legacy-peer-deps
```

### ⚠️ Slow installation?

This is normal! The first install downloads ~1000+ packages (React, Vite, Tailwind, etc.)

**Tips:**
- Use a stable internet connection
- Don't interrupt the process
- It usually takes 2-5 minutes
- Subsequent installs are much faster

---

## 🔄 Going Back to Real Backend

If you want to use the real backend (with MongoDB):

1. **Install MongoDB** (local or use Atlas)
2. **Install server dependencies**:
   ```bash
   cd ../server
   npm install
   ```
3. **Configure environment variables** in `server/.env.development.local`
4. **Disable demo mode** in `client/src/config/demoMode.js`:
   ```javascript
   export const DEMO_MODE = false; // Change to false
   ```
5. **Run both client and server**:
   ```bash
   # From root directory
   npm run dev
   ```

---

## 📚 Need Help?

- Check the main [README.md](README.md) for more information
- Open an issue on GitHub: https://github.com/pratham7723/DineEase/issues
- Contact the maintainer

---

## ✅ Verification Checklist

Before running, make sure:

- [ ] Node.js is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] You're in the `client` directory
- [ ] Dependencies are installed (`dir node_modules` exists)
- [ ] No other app is using port 5173

---

Happy Coding! 🎉

