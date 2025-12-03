import '../styles.css';

import { Link } from 'react-router-dom';
import { useGlobalStore } from '@mfe-notion/shared';

export function App() {
  const { pages, selectedPageId, selectedWorkspace, createPage, selectPage } =
    useGlobalStore();

  const workspaceName = selectedWorkspace?.name ?? 'Workspace';

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{workspaceName}</h2>
          <p className="text-xs text-slate-400">
            Overview de tus páginas. Selecciona una para editarla en el módulo
            de Notes.
          </p>
        </div>
        <button
          onClick={() => createPage('Nueva página')}
          className="text-xs rounded border border-sky-500 px-3 py-1 hover:bg-sky-500 hover:text-slate-900"
        >
          + New page
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pages.map((page) => (
          <article
            key={page.id}
            className={`rounded-lg border p-3 cursor-pointer text-sm ${
              page.id === selectedPageId
                ? 'border-sky-500 bg-slate-900'
                : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
            }`}
            onClick={() => selectPage(page.id)}
          >
            <h3 className="font-semibold mb-1">{page.title || 'Untitled'}</h3>
            <p className="text-xs text-slate-400 line-clamp-2 whitespace-pre-wrap">
              {page.content || 'Empty page'}
            </p>
            <p className="mt-2 text-[10px] text-slate-500">
              Last update:{' '}
              {new Date(page.updatedAt).toLocaleString(undefined, {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </p>
            <Link
              to="/notes"
              className="mt-2 inline-block text-[11px] text-sky-400 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                selectPage(page.id);
              }}
            >
              Open in Notes →
            </Link>
          </article>
        ))}

        {!pages.length && (
          <p className="text-xs text-slate-500 col-span-full">
            No hay páginas. Crea la primera con el botón “New page”.
          </p>
        )}
      </section>
    </div>
  );
}

export default App;
