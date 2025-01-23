import { ipcMain, dialog } from "electron";
import fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

export const registerBackupHandlers = () => {
  ipcMain.handle("save-backup", async (_event, { fileName, data }) => {
    try {
      const { filePath } = await dialog.showSaveDialog({
        defaultPath: fileName,
        filters: [{ name: "Zip files", extensions: ["zip"] }],
      });

      if (!filePath) {
        return { success: false, error: "No file path selected" };
      }

      await writeFile(filePath, data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("read-backup", async (_event, filePath) => {
    try {
      const data = await readFile(filePath);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
};
