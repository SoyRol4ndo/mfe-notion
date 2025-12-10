import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Column, GlobalState, Page, Task } from '../types';

const initialWorkspaceId = 'ws-1';

const initialState: Pick<
  GlobalState,
  'workspaces' | 'pages' | 'selectedWorkspaceId' | 'selectedPageId' | 'theme'
> = {
  theme: 'light',
  workspaces: [
    {
      id: initialWorkspaceId,
      name: 'Personal Workspace',
    },
  ],
  pages: [
    {
      id: 'page-1',
      workspaceId: initialWorkspaceId,
      title: 'Welcome to your Notion MFE',
      content:
        'Esta es tu primera página. Edítala desde el módulo de Notes.\n\nPuedes crear más páginas desde Workspace.',
      updatedAt: new Date().toISOString(),
    },
  ],
  selectedWorkspaceId: initialWorkspaceId,
  selectedPageId: 'page-1',
};

const initialColumns: Column[] = [
  { id: 'col-todo', title: 'To Do', workspaceId: initialWorkspaceId, order: 1 },
  { id: 'col-doing', title: 'Doing', workspaceId: initialWorkspaceId, order: 2 },
  { id: 'col-done', title: 'Done', workspaceId: initialWorkspaceId, order: 3 },
];

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Crea tu primer tablero Kanban',
    description: 'Puedes mover tareas entre columnas en futuros pasos.',
    columnId: 'col-todo',
    workspaceId: initialWorkspaceId,
    updatedAt: new Date().toISOString(),
  },
];

export const useGlobalStore = create<GlobalState>((set, get) => ({
  // -------- STATE BASE --------
  ...initialState,
  columns: initialColumns,
  tasks: initialTasks,

  // -------- THEME --------
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),

  // -------- WORKSPACE / SELECCIÓN --------
  selectWorkspace: (id) =>
    set((state) => {
      const workspaceExists = state.workspaces.some((w) => w.id === id);
      if (!workspaceExists) return state;
      return {
        ...state,
        selectedWorkspaceId: id,
      };
    }),

  selectPage: (id) => set({ selectedPageId: id }),

  // -------- PAGES (NOTES) --------
  createPage: (title = 'Untitled') =>
    set((state) => {
      const workspaceId = state.selectedWorkspaceId ?? initialWorkspaceId;
      const id = nanoid();

      const newPage: Page = {
        id,
        workspaceId,
        title,
        content: '',
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        pages: [newPage, ...state.pages],
        selectedPageId: id,
      };
    }),

  updatePageContent: (id, content) =>
    set((state) => ({
      ...state,
      pages: state.pages.map((p) =>
        p.id === id ? { ...p, content, updatedAt: new Date().toISOString() } : p
      ),
    })),

  renamePage: (id, title) =>
    set((state) => ({
      ...state,
      pages: state.pages.map((p) =>
        p.id === id ? { ...p, title, updatedAt: new Date().toISOString() } : p
      ),
    })),

  deletePage: (id) =>
    set((state) => {
      const pages = state.pages.filter((p) => p.id !== id);
      let selectedPageId = state.selectedPageId;

      if (selectedPageId === id) {
        selectedPageId = pages.length ? pages[0].id : null;
      }

      return {
        ...state,
        pages,
        selectedPageId,
      };
    }),

  // -------- COLUMNS (KANBAN) --------
  createColumn: (title) =>
    set((state) => {
      const id = `col-${Date.now()}`;
      const workspaceId = state.selectedWorkspaceId ?? initialWorkspaceId;

      const newCol: Column = {
        id,
        title,
        workspaceId,
        order: state.columns.length + 1,
      };

      return {
        ...state,
        columns: [...state.columns, newCol],
      };
    }),

  // -------- TASKS (KANBAN) --------
  createTask: (columnId, title, description = '') =>
    set((state) => {
      const id = `task-${Date.now()}`;
      const workspaceId = state.selectedWorkspaceId ?? initialWorkspaceId;

      const newTask: Task = {
        id,
        title,
        description,
        columnId,
        workspaceId,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }),

  updateTask: (taskId, data) =>
    set((state) => ({
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, ...data, updatedAt: new Date().toISOString() }
          : t
      ),
    })),

  moveTaskToColumn: (taskId, columnId) =>
    set((state) => ({
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, columnId } : t
      ),
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      ...state,
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),
  // ----------------------------
  // ▶ CALENDAR: PAGES PLANIFICADAS
  // ----------------------------
  createPageWithSchedule: ({ title = '', content = '', workspaceId = '', startDate = '', endDate = '' }) =>
    set((state) => {
      const wsId = workspaceId ?? state.selectedWorkspaceId ?? initialWorkspaceId;
      const id = nanoid();

      const page: Page = {
        id,
        workspaceId: wsId,
        title: title || 'Untitled',
        content,
        updatedAt: new Date().toISOString(),
        scheduledStart: startDate,
        scheduledEnd: endDate ?? startDate,
      };

      return {
        ...state,
        pages: [page, ...state.pages],
        selectedPageId: id,
      };
    }),
  // ----------------------------
  // ▶ CALENDAR: TASKS PLANIFICADAS
  // ----------------------------
  createTaskWithSchedule: ({ title = '', description = '', workspaceId='', startDate='', endDate='' }) =>
    set((state) => {
      const wsId = workspaceId ?? state.selectedWorkspaceId ?? initialWorkspaceId;

      // buscamos una columna del workspace; si no hay, usamos la primera
      const colForWs = state.columns.find((c) => c.workspaceId === wsId);
      const fallbackCol = state.columns[0];

      if (!colForWs && !fallbackCol) {
        // si no hay columnas, simplemente no creamos nada (demo simple)
        return state;
      }

      const columnId = colForWs?.id ?? fallbackCol.id;
      const id = `task-${Date.now()}`;

      const task: Task = {
        id,
        title: title || 'Untitled task',
        description,
        columnId,
        workspaceId: wsId,
        updatedAt: new Date().toISOString(),
        scheduledStart: startDate,
        scheduledEnd: endDate ?? startDate,
      };

      return {
        ...state,
        tasks: [...state.tasks, task],
      };
    }),
}));