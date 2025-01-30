console.log('Preload script loading...');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('database', {
    createUser: (userData) => ipcRenderer.invoke('create-user', userData),
    loginUser: (loginData) => ipcRenderer.invoke('login-user', loginData),
    getUserById: (userId) => ipcRenderer.invoke('get-user-by-id', userId),
    deleteUser: (userId) => ipcRenderer.invoke('delete-user', userId),
    updateUser: (userData) => ipcRenderer.invoke('update-user', userData)


});
console.log('Preload script finished loading');