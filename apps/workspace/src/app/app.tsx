import '../styles.css';

import * as React from 'react';
import clsx from 'clsx';
import {
  useGlobalStore,
  useThemeColor,
  Button,
  Input,
  Modal,
} from '@mfe-notion/shared';
import { Link } from 'react-router-dom';
import { BiPlus, BiSearch } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';

export function App() {
  const { pages, selectedPageId, createPage, selectPage, toggleTheme } =
    useGlobalStore();

  const { getColor, theme } = useThemeColor();

  const [search, setSearch] = React.useState('');
  const [isNewPageModalOpen, setIsNewPageModalOpen] = React.useState(false);
  const [newPageTitle, setNewPageTitle] = React.useState('');

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

  const openNewPageModal = () => {
    setNewPageTitle('');
    setIsNewPageModalOpen(true);
  };

  const handleCloseNewPageModal = () => {
    setIsNewPageModalOpen(false);
    setNewPageTitle('');
  };

  const handleConfirmNewPage = () => {
    const title = newPageTitle.trim() || 'Untitled';
    createPage(title);
    handleCloseNewPageModal();
  };

  return (
    <div
      style={{
        backgroundColor: getColor('background'),
        color: getColor('text'),
      }}
      className="h-full min-h-screen flex flex-col gap-4 p-4"
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1
            style={{ color: getColor('text_light') }}
            className="text-lg font-semibold"
          >
            Gestiona tus páginas. Haz clic para abrirlas en el editor de Notes.
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button size="lg" variant="secondary" onClick={toggleTheme}>
            Tema: {theme === 'dark' ? 'Dark' : 'Light'}
          </Button>

          <Button
            size="lg"
            variant="primary"
            onClick={openNewPageModal}
            icon={<BiPlus />}
          >
            Nueva página
          </Button>
        </div>
      </header>

      {/* Filtro / búsqueda */}
      <section className="flex items-center gap-2">
        <div className="relative w-full">
          {/* Icono dentro del input */}
          <BiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <Input
            placeholder="Buscar páginas..."
            value={search}
            onChange={(e) => setSearch(e.target.value.trim())}
            style={{
              backgroundColor: getColor('background_light'),
              color: getColor('text'),
              borderColor: getColor('border'),
              paddingLeft: '2.2rem',
            }}
          />
          {search && (
            <CgClose
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer p-1 rounded-full"
              size={25}
              onClick={() => setSearch('')}
            />
          )}
        </div>
      </section>

      {/* Lista de páginas */}
      <section
        className="flex-1 overflow-auto rounded-lg p-2 border"
        style={{
          backgroundColor: getColor('secondary'),
          borderColor: getColor('border'),
        }}
      >
        {filteredPages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-xs gap-2">
            <p style={{ color: getColor('text_light') }}>
              No hay páginas que coincidan con la búsqueda.
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleNewPage}
              style={{
                backgroundColor: getColor('secondary'),
                color: getColor('text'),
                borderColor: getColor('border'),
              }}
            >
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
                    to="/notes"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectPage(page.id);
                    }}
                    className={clsx(
                      'w-full flex flex-col items-start text-left px-3 py-2 rounded-md border transition'
                    )}
                    style={{
                      borderColor: isSelected
                        ? getColor('primary')
                        : getColor('border'),
                      backgroundColor: isSelected
                        ? getColor('background_light1')
                        : 'transparent',
                    }}
                  >
                    <span className="text-[13px] font-medium truncate">
                      {page.title || 'Untitled'}
                    </span>

                    {page.content && (
                      <span
                        className="text-[11px] truncate"
                        style={{ color: getColor('text_light2') }}
                      >
                        {page.content}
                      </span>
                    )}

                    <span
                      className="text-[10px] mt-1"
                      style={{ color: getColor('text_light2') }}
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

      <Modal
        open={isNewPageModalOpen}
        title="Nueva página"
        onClose={handleCloseNewPageModal}
        onConfirm={handleConfirmNewPage}
        confirmText="Aceptar"
        cancelText="Cancelar"
        // onDisabled={!newPageTitle.trim}
      >
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400">Título de la página</label>
          <Input
            autoFocus
            placeholder="Untitled"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default App;
