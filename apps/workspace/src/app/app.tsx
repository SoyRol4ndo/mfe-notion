import '../styles.css';

import * as React from 'react';
import clsx from 'clsx';
import { useGlobalStore, useTheme, Button, Input } from '@mfe-notion/shared';
import { Link } from 'react-router-dom';

export function App() {
  const { pages, selectedPageId, selectWorkspace, createPage, selectPage } =
    useGlobalStore();

  const { theme, palette, toggleTheme } = useTheme();

  const [search, setSearch] = React.useState('');

  const workspaceName = selectWorkspace?.name ?? 'Workspace';

  const filteredPages = React.useMemo(
    () =>
      pages.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase().trim())
      ),
    [pages, search]
  );

  const handleNewPage = () => {
    const newTitle = prompt('Título de la nueva página:', 'Untitled');
    createPage(newTitle || 'Untitled');
  };

  return (
    <div
      className={clsx(
        'h-full min-h-screen flex flex-col gap-4 p-4',
        palette.bodyBg,
        palette.bodyText
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">{workspaceName}</h1>
          <p className={clsx('text-xs', palette.subtleText)}>
            Gestiona tus páginas. Haz clic para abrirlas en el editor de Notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={toggleTheme}>
            Tema: {theme === 'dark' ? 'Dark' : 'Light'}
          </Button>

          <Button size="sm" variant="primary" onClick={handleNewPage}>
            Nueva página
          </Button>
        </div>
      </header>

      {/* Filtro / búsqueda */}
      <section className="flex items-center gap-2">
        <Input
          placeholder="Buscar páginas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={clsx(palette.inputBg, palette.inputBorder, 'border')}
        />
      </section>

      {/* Lista de páginas */}
      <section
        className={clsx(
          'flex-1 overflow-auto rounded-lg p-2 border',
          palette.panelBg,
          palette.panelBorder
        )}
      >
        {filteredPages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-xs gap-2">
            <p className={palette.mutedText}>
              No hay páginas que coincidan con la búsqueda.
            </p>
            <Button size="sm" variant="secondary" onClick={handleNewPage}>
              Crear la primera página
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-1 text-sm">
            {filteredPages.map((page) => {
              const isSelected = page.id === selectedPageId;

              return (
                <li key={page.id}>
                  <Link
                    to={'./notes'}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectPage(page.id);
                    }}
                    className={clsx(
                      'w-full flex flex-col items-start text-left px-3 py-2 rounded-md border transition',
                      isSelected ? 'border-sky-500' : palette.panelBorder,
                      isSelected ? palette.accentSoft : 'hover:bg-slate-800/40'
                    )}
                  >
                    <span className="text-[13px] font-medium truncate">
                      {page.title || 'Untitled'}
                    </span>
                    {page.content && (
                      <span
                        className={clsx(
                          'text-[11px] truncate',
                          palette.subtleText
                        )}
                      >
                        {page.content}
                      </span>
                    )}
                    <span
                      className={clsx('text-[10px] mt-1', palette.mutedText)}
                    >
                      Actualizada: {new Date(page.updatedAt).toLocaleString()}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className={clsx('text-[10px] pt-1', palette.mutedText)}>
        Workspace MFE · Cambia el tema desde aquí y se refleja en todo el
        sistema porque usamos Zustand global.
      </footer>
    </div>
  );
}

export default App;
