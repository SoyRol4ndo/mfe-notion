// WORKSPACES
export type Workspace = {
  id: string;
  name: string;
};

// PAGES (NOTES)
export type Page = {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  updatedAt: string;
};

// KANBAN: COLUMNS
export type Column = {
  id: string;
  title: string;
  workspaceId: string;
  order: number;
};

// KANBAN: TASKS
export type Task = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  workspaceId: string;
  updatedAt: string;
};

// THEME
export type Theme = 'light' | 'dark';

// SHAPE DEL STORE GLOBAL
export interface GlobalState {
  // --- STATE ---
  theme: Theme;

  workspaces: Workspace[];
  pages: Page[];
  columns: Column[];
  tasks: Task[];

  selectedWorkspaceId: string | null;
  selectedPageId: string | null;

  // --- ACTIONS: THEME ---
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // --- ACTIONS: WORKSPACE / PAGES (SELECCIÓN) ---
  selectWorkspace: (id: string) => void;
  selectPage: (id: string | null) => void;

  // --- ACTIONS: PAGES (NOTES) ---
  createPage: (title?: string) => void;
  updatePageContent: (id: string, content: string) => void;
  renamePage: (id: string, title: string) => void;
  deletePage: (id: string) => void;

  // --- ACTIONS: COLUMNS (KANBAN) ---
  createColumn: (title: string) => void;

  // --- ACTIONS: TASKS (KANBAN) ---
  createTask: (columnId: string, title: string, description?: string) => void;
  updateTask: (taskId: string, data: Partial<Task>) => void;
  moveTaskToColumn: (taskId: string, columnId: string) => void;
  deleteTask: (taskId: string) => void;
}