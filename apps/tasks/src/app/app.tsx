import '../styles.css';

import * as React from 'react';
import {
  Button,
  Input,
  useGlobalStore,
  useThemeColor,
} from '@mfe-notion/shared';

export function App() {
  const { getColor } = useThemeColor();
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
    <div
      className="h-full flex gap-4 overflow-auto p-4"
      style={{
        backgroundColor: getColor('background'),
        color: getColor('text'),
      }}
    >
      {visibleColumns.map((col) => {
        const colTasks = tasks.filter((t) => t.columnId === col.id);
        const isNewOpen = openColumnId === col.id;
        const isHover = hoverColumnId === col.id;

        return (
          <div
            key={col.id}
            className="w-72 flex-shrink-0 rounded p-4 flex flex-col border transition"
            style={{
              borderColor: isHover ? getColor('primary') : getColor('border'),
              backgroundColor: isHover
                ? getColor('background_light1') // un poco más claro
                : getColor('background_light'),
            }}
            onDragOver={(e) => handleDragOverColumn(e, col.id)}
            onDrop={(e) => handleDropOnColumn(e, col.id)}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: getColor('header') }}
            >
              {col.title}
            </h3>

            {/* LISTA DE TAREAS */}
            <div className="flex-1 flex flex-col gap-2 mb-3">
              {colTasks.map((task) => {
                const isEditing = editingTaskId === task.id;

                if (isEditing) {
                  return (
                    <form
                      key={task.id}
                      onSubmit={(e) => saveEditing(e, task.id)}
                      className="rounded text-xs flex flex-col gap-2 border p-2"
                      style={{
                        backgroundColor: getColor('background'),
                        borderColor: getColor('primary'),
                        color: getColor('text'),
                      }}
                    >
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Título de la tarea"
                      />
                      <textarea
                        className="rounded px-2 py-1 outline-none resize-none min-h-[60px] text-xs"
                        style={{
                          backgroundColor: getColor('background_light'),
                          color: getColor('text'),
                          borderColor: getColor('border'),
                          borderWidth: 1,
                        }}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Descripción / cuerpo de la tarea"
                      />
                      <div className="flex justify-between mt-1 gap-2">
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save</Button>
                        </div>
                      </div>
                    </form>
                  );
                }

                return (
                  <div
                    key={task.id}
                    className="border p-2 rounded text-sm cursor-pointer transition"
                    style={{
                      backgroundColor: getColor('background'),
                      borderColor:
                        draggedTaskId === task.id
                          ? getColor('border_light')
                          : getColor('border'),
                      opacity: draggedTaskId === task.id ? 0.6 : 1,
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => startEditingTask(task.id)}
                  >
                    <strong
                      className="block text-xs"
                      style={{ color: getColor('text') }}
                    >
                      {task.title}
                    </strong>
                    {task.description && (
                      <p
                        className="text-[11px] mt-1 whitespace-pre-wrap"
                        style={{ color: getColor('text_light') }}
                      >
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
                className="mt-auto flex flex-col gap-2 rounded border p-2"
                style={{
                  backgroundColor: getColor('background'),
                  borderColor: getColor('border'),
                }}
              >
                <Input
                  placeholder="Título de la tarea"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                />
                <textarea
                  className="text-xs rounded px-2 py-1 outline-none resize-none min-h-[60px]"
                  style={{
                    backgroundColor: getColor('background_light'),
                    color: getColor('text'),
                    borderColor: getColor('border'),
                    borderWidth: 1,
                  }}
                  placeholder="Descripción / cuerpo de la tarea"
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-1">
                  <Button
                    variant="danger"
                    type="button"
                    onClick={handleCancelNew}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add</Button>
                </div>
              </form>
            ) : (
              <Button
                onClick={() => handleOpenForm(col.id)}
                variant="secondary"
                style={{
                  backgroundColor: getColor('secondary'),
                  color: getColor('text'),
                  borderColor: getColor('border'),
                }}
              >
                + Add task
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
