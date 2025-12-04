import '../styles.css';

import * as React from 'react';
import { useGlobalStore } from '@mfe-notion/shared';

export function App() {
  const selectedWorkspaceId = useGlobalStore((s) => s.selectedWorkspaceId);
  const columns = useGlobalStore((s) => s.columns);
  const tasks = useGlobalStore((s) => s.tasks);

  const createTask = useGlobalStore((s) => s.createTask);
  const updateTask = useGlobalStore((s) => s.updateTask);
  const deleteTask = useGlobalStore((s) => s.deleteTask);
  const moveTaskToColumn = useGlobalStore((s) => s.moveTaskToColumn);

  // ▶ Estado local para "nueva tarea"
  const [openColumnId, setOpenColumnId] = React.useState<string | null>(null);
  const [draftTitle, setDraftTitle] = React.useState('');
  const [draftDescription, setDraftDescription] = React.useState('');

  // ▶ Estado local para "editar tarea"
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editDescription, setEditDescription] = React.useState('');

  // ▶ Estado para Drag & Drop
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);
  const [hoverColumnId, setHoverColumnId] = React.useState<string | null>(null);

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

  // ---------------------
  // NUEVA TAREA
  // ---------------------
  const handleOpenForm = (columnId: string) => {
    setOpenColumnId(columnId);
    setDraftTitle('');
    setDraftDescription('');
    setEditingTaskId(null);
  };

  const handleCancelNew = () => {
    setOpenColumnId(null);
    setDraftTitle('');
    setDraftDescription('');
  };

  const handleSubmitNew = (e: React.FormEvent, columnId: string) => {
    e.preventDefault();
    if (!draftTitle.trim() && !draftDescription.trim()) return;

    createTask(
      columnId,
      draftTitle.trim() || 'Untitled task',
      draftDescription.trim()
    );

    setOpenColumnId(null);
    setDraftTitle('');
    setDraftDescription('');
  };

  // ---------------------
  // EDITAR / BORRAR TAREA
  // ---------------------
  const startEditingTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setEditingTaskId(taskId);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setOpenColumnId(null);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEditing = (e: React.FormEvent, taskId: string) => {
    e.preventDefault();
    if (!editTitle.trim() && !editDescription.trim()) return;

    updateTask(taskId, {
      title: editTitle.trim() || 'Untitled task',
      description: editDescription.trim(),
    });

    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    if (editingTaskId === taskId) {
      cancelEditing();
    }
  };

  // ---------------------
  // DRAG & DROP
  // ---------------------
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    setDraggedTaskId(taskId);
    // para compatibilidad con algunos navegadores
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setHoverColumnId(null);
  };

  const handleDragOverColumn = (
    e: React.DragEvent<HTMLDivElement>,
    colId: string
  ) => {
    e.preventDefault(); // necesario para permitir drop
    if (hoverColumnId !== colId) {
      setHoverColumnId(colId);
    }
  };

  const handleDropOnColumn = (
    e: React.DragEvent<HTMLDivElement>,
    colId: string
  ) => {
    e.preventDefault();
    const taskIdFromData = e.dataTransfer.getData('text/plain');
    const taskId = taskIdFromData || draggedTaskId;

    if (taskId) {
      moveTaskToColumn(taskId, colId);
    }

    setDraggedTaskId(null);
    setHoverColumnId(null);
  };

  return (
    <div className="h-full flex gap-4 overflow-auto p-4 bg-slate-950 text-slate-100">
      {visibleColumns.map((col) => {
        const colTasks = tasks.filter((t) => t.columnId === col.id);
        const isNewOpen = openColumnId === col.id;
        const isHover = hoverColumnId === col.id;

        return (
          <div
            key={col.id}
            className={`w-64 flex-shrink-0 rounded p-4 flex flex-col border ${
              isHover
                ? 'border-sky-500 bg-slate-900'
                : 'border-slate-700 bg-slate-900/80'
            }`}
            onDragOver={(e) => handleDragOverColumn(e, col.id)}
            onDrop={(e) => handleDropOnColumn(e, col.id)}
          >
            <h3 className="text-lg font-semibold mb-3">{col.title}</h3>

            {/* LISTA DE TAREAS */}
            <div className="flex-1 flex flex-col gap-2 mb-3">
              {colTasks.map((task) => {
                const isEditing = editingTaskId === task.id;

                if (isEditing) {
                  return (
                    <form
                      key={task.id}
                      onSubmit={(e) => saveEditing(e, task.id)}
                      className="bg-slate-800 border border-sky-500 p-2 rounded text-xs flex flex-col gap-2"
                    >
                      <input
                        className="bg-slate-950 rounded px-2 py-1 outline-none border border-slate-700 focus:border-sky-400"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Título de la tarea"
                      />
                      <textarea
                        className="bg-slate-950 rounded px-2 py-1 outline-none border border-slate-700 focus:border-sky-400 resize-none min-h-[60px]"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Descripción / cuerpo de la tarea"
                      />
                      <div className="flex justify-between mt-1 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-[11px] px-2 py-1 rounded border border-red-500/70 text-red-300 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="text-[11px] px-2 py-1 rounded border border-slate-600 hover:border-slate-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="text-[11px] px-2 py-1 rounded border border-sky-500 bg-sky-600/20 hover:bg-sky-600/40"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  );
                }

                return (
                  <div
                    key={task.id}
                    className={`bg-slate-800 border p-2 rounded text-sm cursor-pointer hover:border-sky-400 transition ${
                      draggedTaskId === task.id
                        ? 'opacity-60'
                        : 'border-slate-700'
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => startEditingTask(task.id)}
                  >
                    <strong className="block text-xs">{task.title}</strong>
                    {task.description && (
                      <p className="text-[11px] text-slate-400 mt-1 whitespace-pre-wrap">
                        {task.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FORMULARIO DE NUEVA TAREA */}
            {isNewOpen ? (
              <form
                onSubmit={(e) => handleSubmitNew(e, col.id)}
                className="mt-auto flex flex-col gap-2 border border-slate-700 rounded p-2 bg-slate-900/80"
              >
                <input
                  className="bg-slate-950 text-xs rounded px-2 py-1 outline-none border border-slate-700 focus:border-sky-400"
                  placeholder="Título de la tarea"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                />
                <textarea
                  className="bg-slate-950 text-xs rounded px-2 py-1 outline-none border border-slate-700 focus:border-sky-400 resize-none min-h-[60px]"
                  placeholder="Descripción / cuerpo de la tarea"
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={handleCancelNew}
                    className="text-[11px] px-2 py-1 rounded border border-slate-600 hover:border-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-[11px] px-2 py-1 rounded border border-sky-500 bg-sky-600/20 hover:bg-sky-600/40"
                  >
                    Add
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="mt-auto text-xs border border-slate-600 px-2 py-1 rounded hover:border-sky-400 transition"
                onClick={() => handleOpenForm(col.id)}
              >
                + Add task
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
