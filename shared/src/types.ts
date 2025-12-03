export type Workspace = {
  id: string;
  name: string;
};

export type Page = {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  updatedAt: string; 
};

export type Theme = 'light' | 'dark';


export type GlobalState = {
  workspaces: Workspace[];
  pages: Page[];
  selectedWorkspaceId: string | null;
  selectedPageId: string | null;
  theme: Theme;

  // Derivados / helpers
  selectedWorkspace: Workspace | null;
  selectedPage: Page | null;

  // Acciones
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  selectWorkspace: (id: string) => void;
  selectPage: (id: string | null) => void;

  createPage: (title?: string) => void;
  updatePageContent: (id: string, content: string) => void;
  renamePage: (id: string, title: string) => void;
  deletePage: (id: string) => void;
};