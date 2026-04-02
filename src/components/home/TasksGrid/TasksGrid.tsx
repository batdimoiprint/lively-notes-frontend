import { deleteNotes, useNotes, reorderNotes } from "@/api/notes";
import { type Tasks } from "@/types/tasktypes";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "../../ui/scroll-area";
import { Spinner } from "../../ui/spinner";

import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
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
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

function TasksGrid() {
  const { data: tasks = [], isLoading, error } = useNotes();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderedTasks, setOrderedTasks] = useState<Tasks[]>([]);

  // Sync orderedTasks with tasks when tasks change
  const displayTasks = orderedTasks.length > 0 && orderedTasks.every(t => tasks.some(task => task._id === t._id))
    ? orderedTasks.filter(t => tasks.some(task => task._id === t._id))
    : tasks;

  // Update orderedTasks when tasks from API change
  if (tasks.length > 0 && (orderedTasks.length === 0 || !orderedTasks.every(t => tasks.some(task => task._id === t._id)))) {
    setOrderedTasks(tasks);
  }

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
      setOrderedTasks(tasks);
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedTasks.findIndex((item) => item._id === active.id);
      const newIndex = orderedTasks.findIndex((item) => item._id === over.id);
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
        <ScrollArea className="h-168">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
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
          </DndContext>
        </ScrollArea>

        <TaskSheet task={selectedTask} />
      </Dialog>
    </>
  );
}

export default TasksGrid;
