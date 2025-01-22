import Dexie, { type EntityTable } from "dexie";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Prompt {
  id: string;
  name: string;
  objective: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  content: string;
  comments: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Label {
  id: string;
  name: string;
  color: string;
  type: "category" | "tag" | "status";
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const db = new Dexie("MyPrompts") as Dexie & {
  projects: EntityTable<Project>;
  prompts: EntityTable<Prompt>;
  promptVersions: EntityTable<PromptVersion>;
  labels: EntityTable<Label>;
};

db.version(1).stores({
  projects: "++id, name, description, createdAt, updatedAt",
  prompts: "++id, name, objective, projectId, createdAt, updatedAt",
  promptVersions: "++id, promptId, version, createdAt, updatedAt",
  labels: "++id, name, color, type, description, createdAt, updatedAt",
});

export type { Project, Prompt, PromptVersion, Label };
export { db };
