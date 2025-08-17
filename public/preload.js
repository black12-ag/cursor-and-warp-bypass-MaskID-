const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Execute Python scripts
  executePythonScript: (scriptName, args) => 
    ipcRenderer.invoke('execute-python-script', scriptName, args),
  
  // Listen for script output
  onScriptOutput: (callback) => 
    ipcRenderer.on('script-output', callback),
  
  // Remove script output listener
  removeScriptOutputListener: (callback) => 
    ipcRenderer.removeListener('script-output', callback),
  
  // Request admin privileges
  requestAdminPrivileges: () => 
    ipcRenderer.invoke('request-admin-privileges'),
  
  // Get system information
  getSystemInfo: () => 
    ipcRenderer.invoke('get-system-info'),
  
  // File system operations
  selectDirectory: () => 
    ipcRenderer.invoke('select-directory'),
  
  // Show message boxes
  showMessageBox: (options) => 
    ipcRenderer.invoke('show-message-box', options),
  
  // Platform detection
  platform: process.platform,
  arch: process.arch
});
