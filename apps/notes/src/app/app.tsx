import { Input, useGlobalStore, useThemeColor } from '@mfe-notion/shared';

export function App() {
  const { getColor } = useThemeColor();
  const page = useGlobalStore((s) =>
    s.pages.find((p) => p.id === s.selectedPageId)
  );

  const updatePageContent = useGlobalStore((s) => s.updatePageContent);
  const renamePage = useGlobalStore((s) => s.renamePage);

  if (!page) {
    return (
      <p className="text-sm text-slate-400">
        No hay ninguna página seleccionada. Ve al Workspace y elige una página.
      </p>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {/* Título */}
      <Input
        label="Titulo"
        value={page.title}
        onChange={(e) => renamePage(page.id, e.target.value || 'Untitled')}
        placeholder="Untitled"
      />

      {/* Contenido */}
      <textarea
        className="flex-1 bg-transparent text-sm outline-none border border-slate-700 rounded px-3 py-2 focus:border-sky-400 resize-none leading-relaxed"
        value={page.content}
        style={{ borderColor: getColor('border') }}
        onChange={(e) => updatePageContent(page.id, e.target.value)}
        placeholder="Escribe tu contenido aquí..."
      />
    </div>
  );
}

export default App;
