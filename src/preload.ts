// See the Electron documentation for details on how to use preload scripts:

import { ipcRenderer } from "electron";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
  saveBackup: (fileName: string, data: any) =>
    ipcRenderer.invoke("save-backup", { fileName, data }),
  readBackup: (filePath: string) => ipcRenderer.invoke("read-backup", filePath),
});
