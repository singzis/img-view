const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('imgview', {
  /** Open native directory picker dialog. Returns absolute path or null if cancelled. */
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
});
