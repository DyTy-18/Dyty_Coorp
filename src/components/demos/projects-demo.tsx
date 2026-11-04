"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check, GripVertical, LayoutGrid, List, MessageSquare, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";

// Demo del gestor de proyectos. Datos de ejemplo y solo interfaz: todo vive en memoria y se pierde al recargar.
// Las tarjetas se arrastran entre columnas: con el mouse desde cualquier parte, con el dedo desde el ícono de agarre
// (así el resto de la tarjeta deja hacer scroll). Con teclado, el mismo ícono mueve con las flechas ← →.

const columns = ["Por hacer", "En curso", "En revisión", "Hecho"] as const;
const DONE = columns.length - 1;
const projects = ["Apertura de la sucursal Norte", "Campaña de fin de año"];
const people = ["Ana", "Luis", "Carla"];

type Priority = "Alta" | "Media" | "Baja";
const priorities: Priority[] = ["Alta", "Media", "Baja"];
const priorityDot: Record<Priority, string> = { Alta: "bg-error", Media: "bg-slate", Baja: "bg-ash" };

type Item = { text: string; done: boolean };

type Task = {
  id: number;
  project: number;
  title: string;
  tag: string;
  owner: string;
  due: string;
  late?: boolean;
  priority: Priority;
  col: number;
  checklist: Item[];
  notes: string[];
};

const todo = (...texts: string[]): Item[] => texts.map((text) => ({ text, done: false }));
const done = (...texts: string[]): Item[] => texts.map((text) => ({ text, done: true }));

const initialTasks: Task[] = [
  { id: 1, project: 0, title: "Cotizar muebles para la recepción", tag: "Compras", owner: "Ana", due: "Viernes", priority: "Media", col: 0, checklist: [...done("Pedir 3 cotizaciones"), ...todo("Elegir proveedor")], notes: [] },
  { id: 2, project: 0, title: "Diseñar el letrero de la fachada", tag: "Diseño", owner: "Luis", due: "Lunes", priority: "Alta", col: 0, checklist: [], notes: ["Mandar 2 opciones de color"] },
  { id: 3, project: 0, title: "Contratar internet para el local", tag: "Trámites", owner: "Luis", due: "Miércoles", priority: "Baja", col: 0, checklist: [], notes: [] },
  { id: 4, project: 0, title: "Publicar el anuncio de apertura", tag: "Marketing", owner: "Carla", due: "Ayer", late: true, priority: "Alta", col: 1, checklist: [...done("Texto", "Fotos"), ...todo("Segmentación")], notes: ["Falta aprobar el texto"] },
  { id: 5, project: 0, title: "Instalar el sistema de caja", tag: "Sistemas", owner: "Luis", due: "Jueves", priority: "Media", col: 1, checklist: todo("Comprar impresora de tickets", "Cargar productos"), notes: [] },
  { id: 6, project: 0, title: "Capacitar al personal nuevo", tag: "Personal", owner: "Ana", due: "Sábado", priority: "Media", col: 2, checklist: done("Manual de atención"), notes: ["Revisar con gerencia antes de cerrar"] },
  { id: 7, project: 0, title: "Firmar el contrato de alquiler", tag: "Trámites", owner: "Ana", due: "Lunes", priority: "Alta", col: 3, checklist: [], notes: ["Firmado, copia en la carpeta del proyecto"] },
  { id: 8, project: 0, title: "Sacar la licencia de funcionamiento", tag: "Trámites", owner: "Carla", due: "Martes", priority: "Alta", col: 3, checklist: done("Formulario", "Pago"), notes: [] },
  { id: 9, project: 1, title: "Definir las promociones de diciembre", tag: "Marketing", owner: "Carla", due: "Viernes", priority: "Alta", col: 0, checklist: [], notes: [] },
  { id: 10, project: 1, title: "Grabar video para Instagram", tag: "Marketing", owner: "Luis", due: "Jueves", priority: "Media", col: 1, checklist: [...done("Guion"), ...todo("Grabación", "Edición")], notes: [] },
  { id: 11, project: 1, title: "Pedir stock extra al proveedor", tag: "Compras", owner: "Ana", due: "Ayer", late: true, priority: "Alta", col: 1, checklist: [], notes: ["El proveedor pide confirmar hasta el lunes"] },
  { id: 12, project: 1, title: "Revisar los textos del correo", tag: "Marketing", owner: "Carla", due: "Lunes", priority: "Baja", col: 2, checklist: [], notes: [] },
  { id: 13, project: 1, title: "Armar la lista de clientes", tag: "Ventas", owner: "Ana", due: "Martes", priority: "Media", col: 3, checklist: done("Exportar del CRM", "Quitar duplicados"), notes: [] },
];

type Drag = { id: number; startX: number; startY: number; offX: number; offY: number; width: number; x: number; y: number; active: boolean; over: number | null };

const chip = "label-mono inline-flex items-center rounded-full bg-canvas px-2 py-1 text-slate";
const control =
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-[background-color,color,scale] duration-150 ease-out active:scale-[0.97]";
const darkToggle = (on: boolean) => (on ? "bg-mint text-carbon" : "bg-graphite text-paper hover:bg-slate");
const lightToggle = (on: boolean) => (on ? "bg-carbon text-paper" : "bg-canvas text-carbon hover:bg-ash");
const field =
  "min-h-11 min-w-0 flex-1 rounded-lg px-3 text-sm text-carbon placeholder:text-slate focus-visible:outline-2 focus-visible:outline-offset-2";

export function ProjectsDemo() {
  const [tasks, setTasks] = useState(initialTasks);
  const [project, setProject] = useState(0);
  const [owner, setOwner] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"board" | "list">("board");
  const [openId, setOpenId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState<{ id: number; width: number } | null>(null);
  const dragId = dragging?.id ?? null;
  const [overCol, setOverCol] = useState<number | null>(null);

  const drag = useRef<Drag | null>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const suppressClick = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  // Copia de las tareas para los listeners de window, que se registran una sola vez.
  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const inProject = tasks.filter((t) => t.project === project);
  const q = query.trim().toLowerCase();
  const visible = inProject.filter((t) => (!owner || t.owner === owner) && (!q || t.title.toLowerCase().includes(q)));
  const finished = inProject.filter((t) => t.col === DONE).length;
  const late = inProject.filter((t) => t.late && t.col !== DONE).length;
  const progress = inProject.length ? Math.round((finished / inProject.length) * 100) : 0;
  const openTask = tasks.find((t) => t.id === openId) ?? null;

  function update(id: number, change: (t: Task) => Partial<Task>) {
    setTasks((all) => all.map((t) => (t.id === id ? { ...t, ...change(t) } : t)));
  }

  function moveTo(id: number, col: number) {
    const task = tasksRef.current.find((t) => t.id === id);
    if (!task || task.col === col) return;
    update(id, (t) => ({ col, late: col === DONE ? false : t.late }));
    setStatus(`“${task.title}” pasó a ${columns[col]}.`);
  }

  // Arrastre con pointer events: un solo par de listeners en window que leen el ref.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const d = drag.current;
      if (!d) return;
      d.x = e.clientX;
      d.y = e.clientY;
      if (!d.active) {
        if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return;
        d.active = true;
        document.documentElement.classList.add("demo-dragging");
        setDragging({ id: d.id, width: d.width });
      }
      if (ghost.current) ghost.current.style.transform = `translate3d(${d.x - d.offX}px, ${d.y - d.offY}px, 0) rotate(2deg)`;
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-col]");
      const over = target ? Number(target.dataset.col) : null;
      if (over !== d.over) {
        d.over = over;
        setOverCol(over);
      }
      // Cerca de los bordes de la pantalla la página se desplaza sola (en el celular las columnas van apiladas).
      if (e.clientY < 80) window.scrollBy(0, -14);
      else if (e.clientY > window.innerHeight - 80) window.scrollBy(0, 14);
    }

    function finish(drop: boolean) {
      const d = drag.current;
      drag.current = null;
      if (!d?.active) return;
      // El click que sigue al soltar no debe abrir la tarea; si no llega (se soltó en otro lado), se limpia igual.
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
      document.documentElement.classList.remove("demo-dragging");
      setDragging(null);
      setOverCol(null);
      if (drop && d.over !== null) moveTo(d.id, d.over);
    }

    const up = () => finish(true);
    const cancel = () => finish(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      document.documentElement.classList.remove("demo-dragging");
    };
    // moveTo solo usa setState y tasksRef, que no cambian entre renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Primer cuadro del fantasma: se ubica antes de pintarse.
  useLayoutEffect(() => {
    const d = drag.current;
    if (dragId !== null && d && ghost.current) {
      ghost.current.style.transform = `translate3d(${d.x - d.offX}px, ${d.y - d.offY}px, 0) rotate(2deg)`;
    }
  }, [dragId]);

  function startDrag(e: React.PointerEvent, task: Task, fromHandle: boolean) {
    suppressClick.current = false;
    if (e.button !== 0 || (e.pointerType !== "mouse" && !fromHandle)) return;
    if (e.pointerType === "mouse") e.preventDefault(); // evita seleccionar texto al arrastrar
    const card = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-card]");
    if (!card) return;
    const r = card.getBoundingClientRect();
    drag.current = {
      id: task.id,
      startX: e.clientX,
      startY: e.clientY,
      offX: e.clientX - r.left,
      offY: e.clientY - r.top,
      width: r.width,
      x: e.clientX,
      y: e.clientY,
      active: false,
      over: null,
    };
  }

  function open(id: number) {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    setOpenId(id);
  }

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (openId !== null && !d.open) d.showModal();
    if (openId === null && d.open) d.close();
  }, [openId]);

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    const id = Math.max(...tasks.map((t) => t.id)) + 1;
    setTasks((all) => [
      ...all,
      { id, project, title, tag: "General", owner: "Ana", due: "Sin fecha", priority: "Media", col: 0, checklist: [], notes: [] },
    ]);
    setDraft("");
    setOwner(null);
    setQuery("");
    setStatus(`Tarea “${title}” creada en Por hacer.`);
  }

  function reset() {
    setTasks(initialTasks);
    setOwner(null);
    setQuery("");
    setOpenId(null);
    setStatus("Demo reiniciada.");
  }

  const dragged = tasks.find((t) => t.id === dragId);

  return (
    <div className="rounded-[32px] bg-carbon p-4 text-paper md:p-8">
      {/* Proyecto y resumen */}
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-graphite pb-6">
        <div className="min-w-0">
          <p className="label-mono text-smoke">Proyectos de ejemplo</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Proyecto">
            {projects.map((name, i) => (
              <button
                key={name}
                type="button"
                aria-pressed={project === i}
                onClick={() => {
                  setProject(i);
                  setOwner(null);
                  setQuery("");
                }}
                className={`${control} ${darkToggle(project === i)}`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <p className="flex justify-between text-sm">
            <span>
              {finished} de {inProject.length} hechas
            </span>
            {late > 0 && <span className="font-medium text-volt">{late} atrasada{late > 1 ? "s" : ""}</span>}
          </p>
          <div
            role="progressbar"
            aria-label="Avance del proyecto"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 overflow-hidden rounded-full bg-graphite"
          >
            <div className="h-full origin-left rounded-full bg-mint transition-transform duration-300 ease-out" style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
        </div>
      </div>

      {/* Herramientas */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <label className="relative flex min-w-0 flex-[1_1_220px]">
          <span className="sr-only">Buscar tarea</span>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tarea…"
            className={`${field} bg-paper pl-9 focus-visible:outline-mint`}
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por responsable">
          {[null, ...people].map((p) => (
            <button
              key={p ?? "todos"}
              type="button"
              aria-pressed={owner === p}
              onClick={() => setOwner(p)}
              className={`${control} rounded-full ${darkToggle(owner === p)}`}
            >
              {p ?? "Todos"}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-xl bg-graphite p-1" role="group" aria-label="Vista">
          <button type="button" aria-pressed={view === "board"} onClick={() => setView("board")} className={`${control} ${darkToggle(view === "board")}`}>
            <LayoutGrid size={16} aria-hidden="true" />
            Tablero
          </button>
          <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={`${control} ${darkToggle(view === "list")}`}>
            <List size={16} aria-hidden="true" />
            Lista
          </button>
        </div>
        <button type="button" onClick={reset} className={`${control} bg-graphite text-paper hover:bg-slate`}>
          <RotateCcw size={16} aria-hidden="true" />
          Reiniciar
        </button>
      </div>

      {view === "board" ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((name, col) => {
            const list = visible.filter((t) => t.col === col);
            const isOver = dragId !== null && overCol === col;
            return (
              <section
                key={name}
                data-col={col}
                aria-label={name}
                className={`flex min-h-48 min-w-0 flex-col gap-2 rounded-2xl p-3 transition-colors duration-150 ${
                  isOver ? "bg-slate ring-2 ring-mint" : "bg-graphite"
                }`}
              >
                <h3 className="label-mono flex items-center justify-between px-1 py-1 text-ash">
                  {name}
                  <span className="grid size-6 place-items-center rounded-full bg-carbon text-paper">{list.length}</span>
                </h3>
                {list.map((task) => (
                  <article
                    key={`${task.id}-${task.col}`}
                    data-card
                    className={`demo-in relative rounded-xl bg-paper text-carbon transition-opacity duration-150 ${
                      dragId === task.id ? "opacity-30" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => open(task.id)}
                      onPointerDown={(e) => startDrag(e, task, false)}
                      className="block w-full rounded-xl p-3 pr-12 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint md:cursor-grab"
                    >
                      <CardBody task={task} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Mover “${task.title}”. Arrastra, o usa las flechas izquierda y derecha.`}
                      onPointerDown={(e) => startDrag(e, task, true)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight" && task.col < DONE) moveTo(task.id, task.col + 1);
                        if (e.key === "ArrowLeft" && task.col > 0) moveTo(task.id, task.col - 1);
                      }}
                      className="absolute top-1 right-1 grid size-11 cursor-grab touch-none place-items-center rounded-lg text-slate hover:bg-canvas focus-visible:outline-2 focus-visible:outline-mint"
                    >
                      <GripVertical size={18} aria-hidden="true" />
                    </button>
                  </article>
                ))}
                {list.length === 0 && (
                  <p className="grid flex-1 place-items-center rounded-xl px-2 py-6 text-center text-sm text-smoke">
                    {dragId !== null ? "Suelta aquí" : "Nada por aquí"}
                  </p>
                )}
                {col === 0 && (
                  <form onSubmit={addTask} className="mt-auto flex gap-2 pt-1">
                    <label className="flex min-w-0 flex-1">
                      <span className="sr-only">Nueva tarea</span>
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Nueva tarea…"
                        maxLength={80}
                        className={`${field} bg-paper focus-visible:outline-mint`}
                      />
                    </label>
                    <button type="submit" aria-label="Agregar tarea" className={`${control} bg-mint text-carbon hover:bg-paper`}>
                      <Plus size={18} aria-hidden="true" />
                    </button>
                  </form>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {visible.length === 0 && <li className="rounded-xl bg-graphite p-6 text-center text-sm text-smoke">No hay tareas con ese filtro.</li>}
          {[...visible]
            .sort((a, b) => a.col - b.col)
            .map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => open(task.id)}
                  className="grid w-full gap-2 rounded-xl bg-paper p-4 text-left text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint md:grid-cols-[minmax(0,1fr)_7rem_8rem_6rem] md:items-center md:gap-4"
                >
                  <span className="min-w-0">
                    <span className={`block font-medium ${task.col === DONE ? "text-slate line-through" : ""}`}>{task.title}</span>
                    <span className={`${chip} mt-2`}>{task.tag}</span>
                  </span>
                  <span className="text-sm text-slate">{task.owner}</span>
                  <span className="label-mono text-slate">{columns[task.col]}</span>
                  <span className={`text-sm ${task.late && task.col !== DONE ? "font-medium text-error" : "text-slate"}`}>
                    {task.late && task.col !== DONE ? `Atrasada · ${task.due}` : task.due}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}

      <p className="label-mono mt-6 text-smoke">Datos de ejemplo · nada se guarda</p>
      <p aria-live="polite" className="sr-only">
        {status}
      </p>

      {dragged && (
        <div
          ref={ghost}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[60] rounded-xl bg-paper p-3 pr-12 text-carbon ring-2 ring-mint"
          style={{ width: dragging?.width }}
        >
          <CardBody task={dragged} />
        </div>
      )}

      <dialog
        ref={dialog}
        data-lenis-prevent
        onClose={() => setOpenId(null)}
        onClick={(e) => e.target === e.currentTarget && setOpenId(null)}
        aria-labelledby="demo-task-title"
        className="m-auto max-h-[88dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-[32px] bg-paper p-0 text-carbon backdrop:bg-carbon/70"
      >
        {openTask && (
          <TaskDetail
            key={openTask.id}
            task={openTask}
            onClose={() => setOpenId(null)}
            onMove={(col) => moveTo(openTask.id, col)}
            onChange={(change) => update(openTask.id, change)}
            onDelete={() => {
              setTasks((all) => all.filter((t) => t.id !== openTask.id));
              setOpenId(null);
              setStatus(`Tarea “${openTask.title}” eliminada.`);
            }}
          />
        )}
      </dialog>
    </div>
  );
}

function CardBody({ task }: { task: Task }) {
  const checked = task.checklist.filter((i) => i.done).length;
  const isLate = task.late && task.col !== DONE;
  return (
    <>
      <span className="flex flex-wrap items-center gap-2">
        <span className={chip}>{task.tag}</span>
        <span className="flex items-center gap-1.5 text-xs text-slate">
          <span aria-hidden="true" className={`size-2 rounded-full ${priorityDot[task.priority]}`} />
          {task.priority}
        </span>
      </span>
      <span className={`mt-2 block font-medium ${task.col === DONE ? "text-slate line-through" : ""}`}>{task.title}</span>
      <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-canvas text-xs font-medium text-carbon">
            {task.owner[0]}
          </span>
          {task.owner}
        </span>
        <span className={isLate ? "font-medium text-error" : ""}>{isLate ? `Atrasada · ${task.due}` : task.due}</span>
        {task.checklist.length > 0 && (
          <span className="flex items-center gap-1">
            <Check size={14} aria-hidden="true" />
            {checked}/{task.checklist.length}
          </span>
        )}
        {task.notes.length > 0 && (
          <span className="flex items-center gap-1">
            <MessageSquare size={14} aria-hidden="true" />
            {task.notes.length}
            <span className="sr-only">{task.notes.length === 1 ? "nota" : "notas"}</span>
          </span>
        )}
      </span>
    </>
  );
}

type DetailProps = {
  task: Task;
  onClose: () => void;
  onMove: (col: number) => void;
  onChange: (change: (t: Task) => Partial<Task>) => void;
  onDelete: () => void;
};

function TaskDetail({ task, onClose, onMove, onChange, onDelete }: DetailProps) {
  const [item, setItem] = useState("");
  const [note, setNote] = useState("");
  const itemId = useId();
  const noteId = useId();
  const checked = task.checklist.filter((i) => i.done).length;

  function addItem(e: React.FormEvent) {
    e.preventDefault();
    const text = item.trim();
    if (!text) return;
    onChange((t) => ({ checklist: [...t.checklist, { text, done: false }] }));
    setItem("");
  }

  function addNote(e: React.FormEvent) {
    e.preventDefault();
    const text = note.trim();
    if (!text) return;
    onChange((t) => ({ notes: [...t.notes, text] }));
    setNote("");
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className={chip}>{task.tag}</span>
          <h3 id="demo-task-title" className="mt-3 text-2xl leading-[1.15] font-medium tracking-[-0.02em]">
            {task.title}
          </h3>
          <p className={`mt-1 text-sm ${task.late && task.col !== DONE ? "font-medium text-error" : "text-slate"}`}>
            {task.late && task.col !== DONE ? `Atrasada · venció ${task.due.toLowerCase()}` : `Entrega: ${task.due}`}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar" className={`${control} bg-canvas hover:bg-ash`}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <Group label="Estado">
        {columns.map((name, col) => (
          <button key={name} type="button" aria-pressed={task.col === col} onClick={() => onMove(col)} className={`${control} ${lightToggle(task.col === col)}`}>
            {name}
          </button>
        ))}
      </Group>

      <Group label="Responsable">
        {people.map((p) => (
          <button key={p} type="button" aria-pressed={task.owner === p} onClick={() => onChange(() => ({ owner: p }))} className={`${control} rounded-full ${lightToggle(task.owner === p)}`}>
            {p}
          </button>
        ))}
      </Group>

      <Group label="Prioridad">
        {priorities.map((p) => (
          <button key={p} type="button" aria-pressed={task.priority === p} onClick={() => onChange(() => ({ priority: p }))} className={`${control} ${lightToggle(task.priority === p)}`}>
            <span aria-hidden="true" className={`size-2 rounded-full ${priorityDot[p]}`} />
            {p}
          </button>
        ))}
      </Group>

      <div>
        <p className="label-mono flex justify-between text-slate">
          Checklist
          {task.checklist.length > 0 && (
            <span>
              {checked}/{task.checklist.length}
            </span>
          )}
        </p>
        {task.checklist.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1">
            {task.checklist.map((i, n) => (
              <li key={n}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 hover:bg-canvas">
                  <input
                    type="checkbox"
                    checked={i.done}
                    onChange={() =>
                      onChange((t) => ({ checklist: t.checklist.map((c, k) => (k === n ? { ...c, done: !c.done } : c)) }))
                    }
                    className="size-5 accent-carbon"
                  />
                  <span className={i.done ? "text-slate line-through" : ""}>{i.text}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={addItem} className="mt-3 flex gap-2">
          <label htmlFor={itemId} className="sr-only">
            Agregar pendiente
          </label>
          <input id={itemId} value={item} onChange={(e) => setItem(e.target.value)} placeholder="Agregar pendiente…" maxLength={80} className={`${field} bg-canvas focus-visible:outline-carbon`} />
          <button type="submit" aria-label="Agregar pendiente" className={`${control} bg-carbon text-paper hover:bg-graphite`}>
            <Plus size={18} aria-hidden="true" />
          </button>
        </form>
      </div>

      <div>
        <p className="label-mono text-slate">Notas</p>
        {task.notes.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {task.notes.map((n, i) => (
              <li key={i} className="rounded-lg bg-canvas px-3 py-2 text-sm">
                {n}
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={addNote} className="mt-3 flex gap-2">
          <label htmlFor={noteId} className="sr-only">
            Agregar nota
          </label>
          <input id={noteId} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Agregar nota…" maxLength={120} className={`${field} bg-canvas focus-visible:outline-carbon`} />
          <button type="submit" className={`${control} bg-carbon text-paper hover:bg-graphite`}>
            Guardar
          </button>
        </form>
      </div>

      <button type="button" onClick={onDelete} className={`${control} self-start text-error hover:bg-canvas`}>
        <Trash2 size={16} aria-hidden="true" />
        Eliminar tarea
      </button>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className="label-mono text-slate">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
