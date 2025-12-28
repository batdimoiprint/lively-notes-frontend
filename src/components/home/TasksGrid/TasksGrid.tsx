import { deleteNotes, useNotes } from "@/api/notes";
import { type Tasks } from "@/types/tasktypes";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "../../ui/scroll-area";
import { Spinner } from "../../ui/spinner";

import { Sheet } from "@/components/ui/sheet";
import React, { useState } from "react";
import { toast } from "sonner";
import TaskCard from "./TaskCard";
import TaskSheet from "./TaskSheetForm";

const TasksGrid = React.memo(function TasksGrid() {
    const { data: tasks = [], isLoading, error } = useNotes();
    const queryClient = useQueryClient();
    const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: deleteNotes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast("Notes Deleted")

        },
        onError: (error) => {
            console.log(error);
        },
        onSettled: () => setDeletingId(null)
    });




    if (isLoading) return <Spinner />;
    if (error) return <div>Error loading notes</div>;

    return (
        <>
            <Sheet>
                <ScrollArea className="h-168">
                    <div className="grid grid-cols-6 gap-4">
                        {tasks.map((task: Tasks) => (
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
                </ScrollArea>

                <TaskSheet task={selectedTask} />

            </Sheet>
        </>
    );
});

export default TasksGrid;
