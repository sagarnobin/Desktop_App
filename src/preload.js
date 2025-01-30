console.log('Preload script loading...');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('database', {
    createUser: (userData) => ipcRenderer.invoke('create-user', userData),
    loginUser: (loginData) => ipcRenderer.invoke('login-user', loginData)
});
console.log('Preload script finished loading');