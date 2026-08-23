"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import type { Constraint, Project } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { PanelHeader } from "./panel-header";
import { ProjectEditor } from "./project-editor";

function newProject(): Project {
  return {
    id: "new-project",
    title: "New project",
    category: "Category",
    tier: "additional",
    status: "personal",
    visibility: "public",
    featured: false,
    accent: "mineral",
    role: "Sole developer",
    summary: "A short summary of the project.",
    constraints: [],
    technologies: [],
    implementation: [],
    highlights: [],
    outcomes: [],
    claims: [],
    links: [],
    images: [],
  };
}

const TIER_LABEL: Record<Project["tier"], string> = {
  flagship: "Flagship",
  featured: "Featured",
  production: "Production",
  additional: "Additional",
};

function Row({
  project,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-md border border-adminLine bg-adminPanel px-3 py-2.5"
    >
      <button
        type="button"
        className="cursor-grab touch-none text-adminMuted hover:text-adminInk"
        aria-label={`Reorder ${project.title}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {project.title}
          {project.visibility === "private" && (
            <span className="ml-2 font-mono text-[0.62rem] uppercase text-amber-400">private</span>
          )}
        </p>
        <p className="truncate font-mono text-[0.65rem] text-adminMuted">
          {TIER_LABEL[project.tier]} · {project.status} · {project.id}
        </p>
      </div>
      <button
        type="button"
        onClick={onToggleVisibility}
        aria-label={project.visibility === "public" ? "Hide from site" : "Show on site"}
        className="rounded p-1.5 text-adminMuted hover:text-adminAccent"
      >
        {project.visibility === "public" ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${project.title}`}
        className="rounded p-1.5 text-adminMuted hover:text-adminAccent"
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${project.title}`}
        className="rounded p-1.5 text-adminMuted hover:text-red-400"
      >
        <Trash2 size={15} />
      </button>
    </li>
  );
}

export function ProjectsPanel({
  projects,
  constraints,
  onChange,
}: {
  projects: Project[];
  constraints: Constraint[];
  onChange: (projects: Project[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const editing = projects.find((p) => p.id === editingId) ?? null;

  if (editing) {
    return (
      <ProjectEditor
        project={editing}
        constraints={constraints}
        allIds={projects.map((p) => p.id)}
        onBack={() => setEditingId(null)}
        onChange={(updated) =>
          onChange(projects.map((p) => (p.id === editing.id ? updated : p)))
        }
      />
    );
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    onChange(arrayMove(projects, oldIndex, newIndex));
  }

  function handleAdd() {
    const p = newProject();
    let id = p.id;
    let n = 1;
    while (projects.some((x) => x.id === id)) id = `${p.id}-${++n}`;
    const created = { ...p, id };
    onChange([...projects, created]);
    setEditingId(id);
  }

  return (
    <div>
      <PanelHeader
        title="Projects"
        subtitle="Drag to reorder within a tier. Edit, hide or delete. Order on the site follows this list within each tier."
        action={
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-md bg-adminAccent px-3 py-2 text-sm font-medium text-adminBg"
          >
            <Plus size={15} /> Add project
          </button>
        }
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2">
            {projects.map((p) => (
              <Row
                key={p.id}
                project={p}
                onEdit={() => setEditingId(p.id)}
                onToggleVisibility={() =>
                  onChange(
                    projects.map((x) =>
                      x.id === p.id
                        ? { ...x, visibility: x.visibility === "public" ? "private" : "public" }
                        : x,
                    ),
                  )
                }
                onDelete={() => {
                  if (confirm(`Delete "${p.title}"? This only affects your draft.`)) {
                    onChange(projects.filter((x) => x.id !== p.id));
                  }
                }}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {/* keep slugify referenced for id hints in the editor */}
      <p className="mt-4 font-mono text-[0.65rem] text-adminMuted">
        Tip: ids are kebab-case (e.g. {slugify("My New System")}).
      </p>
    </div>
  );
}
