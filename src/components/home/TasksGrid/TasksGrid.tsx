import { deleteNotes, useNotes, reorderNotes, moveNoteToSection } from "@/api/notes";
import { type Tasks } from "@/types/tasktypes";
import SectionsSidebar from "./Sidebar/SectionsSidebar";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "../../ui/scroll-area";
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
          <div className="flex h-full gap-4 ">
            <SectionsSidebar
              selectedSection={selectedSection}
              onSectionSelect={onSectionSelect}
              sectionCounts={sectionCounts}
            />
            <ScrollArea className="h-168 flex-1">
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

export default TasksGrid;
