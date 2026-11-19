// Puente seguro entre el juego y Electron: solo expone "quit" (cerrar el juego).
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('nomercy', {
  quit: () => ipcRenderer.send('nomercy:quit')
});
