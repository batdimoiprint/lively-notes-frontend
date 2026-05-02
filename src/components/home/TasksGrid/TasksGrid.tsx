import { deleteNotes, useNotes, reorderNotes, moveNoteToSection } from "@/api/notes";
import { type Tasks } from "@/types/tasktypes";
import SectionsSidebar from "./Sidebar/SectionsSidebar";
import { useSections, type Section } from "@/api/sections";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { Spinner } from "../../ui/spinner";

import { Dialog } from "@/components/ui/dialog";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import TaskCard from "./TaskCard";
import TaskSheet from "./TaskSheetForm";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  pointerWithin,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

interface TasksGridProps {
  selectedSection: string;
  onSectionSelect: (sectionId: string) => void;
}

function TasksGrid({ selectedSection, onSectionSelect }: TasksGridProps) {
  const { data: tasks = [], isLoading, error } = useNotes();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderedTasks, setOrderedTasks] = useState<Tasks[]>([]);

  // Filter tasks by selected section - treat undefined/null sectionId as "default"
  const sectionTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskSectionId = (task as any).sectionId || "default";
      return taskSectionId === selectedSection;
    });
  }, [tasks, selectedSection]);

  const sectionCounts = useMemo(() => {
    return tasks.reduce<Record<string, number>>((counts, task) => {
      const sectionId = (task as any).sectionId || "default";
      counts[sectionId] = (counts[sectionId] ?? 0) + 1;
      return counts;
    }, {});
  }, [tasks]);

  // Sync orderedTasks with sectionTasks when they change
  useEffect(() => {
    setOrderedTasks(sectionTasks);
  }, [sectionTasks]);

  const displayTasks = useMemo(() => {
    if (orderedTasks.length > 0 && orderedTasks.every(t => sectionTasks.some(task => task._id === t._id))) {
      return orderedTasks;
    }
    return sectionTasks;
  }, [orderedTasks, sectionTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const mutation = useMutation({
    mutationFn: deleteNotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast("Notes Deleted");
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => setDeletingId(null),
  });

  const reorderMutation = useMutation({
    mutationFn: reorderNotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to reorder notes");
      setOrderedTasks(sectionTasks);
    },
  });

  const moveSectionMutation = useMutation({
    mutationFn: ({ noteId, sectionId }: { noteId: string; sectionId: string }) =>
      moveNoteToSection(noteId, sectionId),
    onSuccess: (_, { sectionId }) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("Note moved to section");
      onSectionSelect(sectionId);
    },
    onError: () => {
      toast.error("Failed to move note");
    },
  });

  // Custom collision detection - prioritize section droppables over sortable items
  const customCollisionDetection = (args: any) => {
    // First check for section droppables using pointerWithin
    const pointerCollisions = pointerWithin(args);
    const sectionCollision = pointerCollisions.find((c: any) => String(c.id).startsWith("section-"));
    if (sectionCollision) {
      return [sectionCollision];
    }
    // Otherwise use closestCenter for sortable items
    return closestCenter(args);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Check if dropped on a section (section IDs are strings, note IDs are strings too)
    const overId = String(over.id);
    const activeId = String(active.id);

    // If dropped on a section (starts with "section-")
    if (overId.startsWith("section-")) {
      const targetSectionId = overId.replace("section-", "");
      const note = tasks.find((t) => t._id === activeId);
      const currentSectionId = (note as any)?.sectionId || "default";
      
      if (note && currentSectionId !== targetSectionId) {
        moveSectionMutation.mutate({ noteId: activeId, sectionId: targetSectionId });
      }
      return;
    }

    // Otherwise, it's reordering within the same section
    if (activeId !== overId) {
      const oldIndex = orderedTasks.findIndex((item) => item._id === activeId);
      const newIndex = orderedTasks.findIndex((item) => item._id === overId);
      const newOrder = arrayMove(orderedTasks, oldIndex, newIndex);
      
      setOrderedTasks(newOrder);
      
      const orderedIds = newOrder.map((task) => task._id);
      reorderMutation.mutate(orderedIds);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading notes</div>;

  return (
    <>
      <Dialog open={Boolean(selectedTask)} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragEnd={handleDragEnd}
        >
          {/* Mobile: tabs on top, notes below. sm+: sidebar left, notes right */}
          <MobileSectionTabs
            selectedSection={selectedSection}
            onSectionSelect={onSectionSelect}
            sectionCounts={sectionCounts}
          />

          <div className="flex h-full gap-4">
            {/* Desktop sidebar — hidden on mobile */}
            <div className="hidden sm:block">
              <SectionsSidebar
                selectedSection={selectedSection}
                onSectionSelect={onSectionSelect}
                sectionCounts={sectionCounts}
              />
            </div>

            <ScrollArea className="h-auto flex-1 sm:h-168">
              <SortableContext items={displayTasks.map((t) => t._id)} strategy={rectSortingStrategy}>
                <div className="grid gap-4 sm:grid-cols-4">
                  {displayTasks.map((task: Tasks) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      deletingId={deletingId}
                      setDeletingId={setDeletingId}
                      setSelectedTask={setSelectedTask}
                      mutation={mutation}
                    />
                  ))}
                </div>
              </SortableContext>
            </ScrollArea>
          </div>
        </DndContext>

        <TaskSheet task={selectedTask} />
      </Dialog>
    </>
  );
}

// ── Mobile-only horizontal tab strip ────────────────────────────────────────
interface MobileSectionTabsProps {
  selectedSection: string;
  onSectionSelect: (id: string) => void;
  sectionCounts: Record<string, number>;
}

function MobileSectionTabs({ selectedSection, onSectionSelect, sectionCounts }: MobileSectionTabsProps) {
  const { data: rawSections = [] } = useSections();

  const sections: Section[] = useMemo(() => {
    const hasDefault = rawSections.some((s) => s._id === "default");
    const base = hasDefault
      ? rawSections
      : [{ _id: "default", title: "Notes", order: 0, noteCount: 0, createdAt: new Date().toISOString() }, ...rawSections];
    return base.map((s) => ({ ...s, noteCount: sectionCounts[s._id] ?? 0 }));
  }, [rawSections, sectionCounts]);

  return (
    <div className="mb-3 sm:hidden">
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-1">
          {sections.map((section) => {
            const isSelected = selectedSection === section._id;
            return (
              <button
                key={section._id}
                onClick={() => onSectionSelect(section._id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {section.title}
                {section.noteCount !== undefined && section.noteCount > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {section.noteCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

export default TasksGrid;
