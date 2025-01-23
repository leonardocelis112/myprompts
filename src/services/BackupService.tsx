import { db } from "../../db";
import JSZip from "jszip";
import { Buffer } from "buffer";

interface Collections {
  prompts: any[];
  promptVersions: any[];
  projects: any[];
  labels: any[];
}

export class BackupService {
  private backupData: Collections;

  constructor() {
    this.backupData = {
      prompts: [],
      promptVersions: [],
      projects: [],
      labels: [],
    };
  }

  public async createBackup(): Promise<void> {
    try {
      // Fetch all collections
      const [prompts, promptVersions, projects, labels] = await Promise.all([
        db.prompts.toArray(),
        db.promptVersions.toArray(),
        db.projects.toArray(),
        db.labels.toArray(),
      ]);

      this.backupData = {
        prompts,
        promptVersions,
        projects,
        labels,
      };

      // Create zip file
      const zip = new JSZip();
      const backupDate = new Date().toISOString().split("T")[0];

      // Add collections to zip
      zip.file(
        "prompts.json",
        JSON.stringify(this.backupData.prompts, null, 2)
      );
      zip.file(
        "promptVersions.json",
        JSON.stringify(this.backupData.promptVersions, null, 2)
      );
      zip.file(
        "projects.json",
        JSON.stringify(this.backupData.projects, null, 2)
      );
      zip.file("labels.json", JSON.stringify(this.backupData.labels, null, 2));

      // Generate zip file
      const content = await zip.generateAsync({ type: "blob" });

      const buffer = Buffer.from(await content.arrayBuffer());

      // Send to electron main process to save file
      const result = await (window as any).ipcRenderer.saveBackup(
        `myprompts-backup-${backupDate}.zip`,
        buffer
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log("Backup created successfully");
    } catch (error) {
      console.error("Error creating backup:", error);
      throw error;
    }
  }

  public async restoreBackup(file: File): Promise<void> {
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);

      // Parse each collection
      const prompts = JSON.parse(
        (await contents.file("prompts.json")?.async("string")) || "[]"
      );
      const promptVersions = JSON.parse(
        (await contents.file("promptVersions.json")?.async("string")) || "[]"
      );
      const projects = JSON.parse(
        (await contents.file("projects.json")?.async("string")) || "[]"
      );
      const labels = JSON.parse(
        (await contents.file("labels.json")?.async("string")) || "[]"
      );

      // Merge data using transaction
      await db.transaction(
        "rw",
        db.prompts,
        db.promptVersions,
        db.projects,
        db.labels,
        async () => {
          // Get existing records
          const existingPrompts = await db.prompts.toArray();
          const existingVersions = await db.promptVersions.toArray();
          const existingProjects = await db.projects.toArray();
          const existingLabels = await db.labels.toArray();

          // Helper function to merge arrays based on ID
          const mergeArrays = <T extends { id: string }>(
            existing: T[],
            incoming: T[]
          ): T[] => {
            const merged = [...existing];
            const existingIds = new Set(existing.map((item) => item.id));

            incoming.forEach((item) => {
              const index = merged.findIndex((e) => e.id === item.id);
              if (index >= 0) {
                merged[index] = { ...merged[index], ...item };
              } else if (!existingIds.has(item.id)) {
                merged.push(item);
              }
            });

            return merged;
          };

          // Merge each collection
          const mergedPrompts = mergeArrays(existingPrompts, prompts);
          const mergedVersions = mergeArrays(existingVersions, promptVersions);
          const mergedProjects = mergeArrays(existingProjects, projects);
          const mergedLabels = mergeArrays(existingLabels, labels);

          // Clear and update each collection
          await Promise.all([
            db.prompts.clear(),
            db.promptVersions.clear(),
            db.projects.clear(),
            db.labels.clear(),
          ]);

          // Add merged data
          await Promise.all([
            db.prompts.bulkAdd(mergedPrompts),
            db.promptVersions.bulkAdd(mergedVersions),
            db.projects.bulkAdd(mergedProjects),
            db.labels.bulkAdd(mergedLabels),
          ]);
        }
      );

      console.log("Backup restored successfully");
    } catch (error) {
      console.error("Error restoring backup:", error);
      throw error;
    }
  }

  public clearBackup(): void {
    this.backupData = {
      prompts: [],
      promptVersions: [],
      projects: [],
      labels: [],
    };
    console.log("Backup cleared.");
  }
}
