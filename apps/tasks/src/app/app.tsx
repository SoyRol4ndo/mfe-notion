import '../styles.css';

import { useGlobalStore } from '@mfe-notion/shared';

export function App() {
  const selectedWorkspaceId = useGlobalStore((s) => s.selectedWorkspaceId);
  const columns = useGlobalStore((s) => s.columns);
  const tasks = useGlobalStore((s) => s.tasks);
  const createTask = useGlobalStore((s) => s.createTask);

  if (!selectedWorkspaceId) {
    return (
      <p className="text-slate-400 text-sm">
        No hay ningún Workspace seleccionado.
      </p>
    );
  }

  const visibleColumns = columns
    .filter((c) => c.workspaceId === selectedWorkspaceId)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="h-full flex gap-4 overflow-auto p-4 bg-slate-950 text-slate-100">
      {visibleColumns.map((col) => {
        const colTasks = tasks.filter((t) => t.columnId === col.id);

        return (
          <div
            key={col.id}
            className="w-64 flex-shrink-0 bg-slate-900 border border-slate-700 rounded p-4"
          >
            <h3 className="text-lg font-semibold mb-3">{col.title}</h3>

            <div className="flex flex-col gap-2">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-800 border border-slate-700 p-2 rounded text-sm cursor-pointer hover:border-sky-400 transition"
                >
                  <strong>{task.title}</strong>
                  {task.description && (
                    <p className="text-xs text-slate-400 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              className="mt-3 text-xs border border-slate-600 px-2 py-1 rounded hover:border-sky-400 transition"
              onClick={() => createTask(col.id, 'Nueva tarea')}
            >
              + Add task
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
