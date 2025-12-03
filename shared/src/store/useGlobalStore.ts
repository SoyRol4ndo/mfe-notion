import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { GlobalState, Page } from '../types';

const initialWorkspaceId = 'ws-1';

const initialState: Pick<
  GlobalState,
  'workspaces' | 'pages' | 'selectedWorkspaceId' | 'selectedPageId' | 'theme'
> = {
  theme: 'dark',
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

export const useGlobalStore = create<GlobalState>((set, get) => ({
  ...initialState,

  get selectedWorkspace() {
    const { workspaces, selectedWorkspaceId } = get();
    return workspaces.find( (w) => w.id === selectedWorkspaceId) ?? null
  },
  get selectedPage() {
    const { selectedPageId, pages } = get();
    return pages.find( (p) =>  p.id === selectedPageId) ?? null
  },
    setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),

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

  createPage: (title = 'Untitled') =>
    set((state) => {
      const workspaceId = state.selectedWorkspaceId ?? initialWorkspaceId;
      const id = nanoid(); // id único

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
}))