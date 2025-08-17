const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../src/assets/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Development tools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for running Python scripts
ipcMain.handle('execute-python-script', async (event, scriptName, args = []) => {
  return new Promise((resolve, reject) => {
    const scriptPath = getScriptPath(scriptName);
    
    if (!fs.existsSync(scriptPath)) {
      reject(new Error(`Script not found: ${scriptName}`));
      return;
    }

    const pythonExecutable = getPythonExecutable();
    const process = spawn(pythonExecutable, [scriptPath, ...args]);
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      // Send real-time output to renderer
      mainWindow.webContents.send('script-output', {
        scriptName,
        type: 'stdout',
        data: output
      });
    });
    
    process.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      mainWindow.webContents.send('script-output', {
        scriptName,
        type: 'stderr',
        data: output
      });
    });
    
    process.on('close', (code) => {
      resolve({
        exitCode: code,
        stdout,
        stderr,
        success: code === 0
      });
    });
    
    process.on('error', (error) => {
      reject(error);
    });
  });
});

// Get platform-specific Python executable
function getPythonExecutable() {
  const platform = process.platform;
  
  if (platform === 'win32') {
    return 'python';
  } else {
    return 'python3';
  }
}

// Get script path
function getScriptPath(scriptName) {
  const backendDir = isDev 
    ? path.join(__dirname, '../backend')
    : path.join(process.resourcesPath, 'backend');
    
  return path.join(backendDir, `${scriptName}.py`);
}

// Handle requests for admin privileges
ipcMain.handle('request-admin-privileges', async () => {
  if (process.platform === 'win32') {
    // On Windows, the app should already be running as admin if needed
    return { success: true, isAdmin: true };
  } else if (process.platform === 'darwin') {
    // On macOS, we'll use AppleScript to request admin privileges
    return new Promise((resolve) => {
      const script = spawn('osascript', ['-e', 'do shell script "whoami" with administrator privileges']);
      
      script.on('close', (code) => {
        resolve({
          success: code === 0,
          isAdmin: code === 0
        });
      });
      
      script.on('error', () => {
        resolve({
          success: false,
          isAdmin: false
        });
      });
    });
  } else {
    // Linux - check if running as root or with sudo
    const isRoot = process.getuid && process.getuid() === 0;
    return { success: isRoot, isAdmin: isRoot };
  }
});

// Handle system info requests
ipcMain.handle('get-system-info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    appVersion: app.getVersion()
  };
});

// Handle file/directory selection
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  return result;
});

// Handle showing message boxes
ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});
