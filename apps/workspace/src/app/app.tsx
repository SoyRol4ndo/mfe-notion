import { Page, Workspace } from 'shared/src/types';
import '../styles.css';

import { useGlobalStore } from '@mfe-notion/shared';

export function App() {
  const pages = useGlobalStore((s) => s.pages);
  const selectedPageId = useGlobalStore((s) => s.selectedPageId);
  const workspaces = useGlobalStore((s) => s.workspaces);
  const selectedWorkspaceId = useGlobalStore((s) => s.selectedWorkspaceId);
  const createPage = useGlobalStore((s) => s.createPage);
  const selectPage = useGlobalStore((s) => s.selectPage);

  const selectedWorkspace: Workspace | null =
    workspaces.find((w) => w.id === selectedWorkspaceId) ?? null;

  const workspaceName = selectedWorkspace?.name ?? 'Workspace';

  return (
    <div className="h-full flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{workspaceName}</h2>
        <button
          className="text-xs border border-slate-600 px-2 py-1 rounded hover:border-sky-400"
          onClick={() => createPage('New page')}
        >
          + New page
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pages.map((page: Page) => (
          <article
            key={page.id}
            className={`rounded-lg border p-3 cursor-pointer text-sm ${
              page.id === selectedPageId
                ? 'border-sky-400 bg-slate-900'
                : 'border-slate-700 bg-slate-900/40'
            }`}
            onClick={() => selectPage(page.id)}
          >
            <h3 className="font-semibold mb-1">{page.title || 'Untitled'}</h3>
            <p className="text-xs text-slate-400 line-clamp-2 whitespace-pre-line">
              {page.content || 'Empty page'}
            </p>
          </article>
        ))}
      </section>

      <footer className="text-[10px] text-slate-500">
        Workspace y Notes comparten el mismo Zustand global.
      </footer>
    </div>
  );
}

export default App;
