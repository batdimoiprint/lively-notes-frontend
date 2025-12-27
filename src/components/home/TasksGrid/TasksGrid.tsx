import { X } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader } from "../../ui/card";
// import React, { useEffect, useState } from "react"
import { deleteNotes, useNotes } from "@/api/notes";
import { type Tasks } from "@/types/tasktypes";

import { Spinner } from "../../ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "../../ui/scroll-area";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import TaskSheet from "./TaskSheetForm";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const TasksGrid = React.memo(function TasksGrid() {
    const { data: tasks = [], isLoading, error } = useNotes();
    const queryClient = useQueryClient();
    const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: deleteNotes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
        onError: (error) => {
            console.log(error);
        },
    });

    if (isLoading) return <Spinner />;
    if (error) return <div>Error loading notes</div>;

    return (
        <>
            <Sheet>
                <ScrollArea className="pb-4 h-180">
                    <div className="grid grid-cols-6 gap-4">
                        {tasks.map((task: Tasks) => {
                            return (
                                <Card
                                    key={task._id}
                                    className="p-2 overflow-hidden max-h-48 backdrop-blur-md dark:bg-card/20"
                                >
                                    <CardHeader>
                                        {/* {task._id} */}
                                        {task.title}
                                        <CardAction>
                                            <Button
                                                onClick={async () => {
                                                    setDeletingId(task._id);
                                                    mutation.mutate(task._id, {
                                                        onSettled: () => setDeletingId(null)
                                                    });
                                                }}
                                                variant="ghost"
                                            >
                                                {deletingId === task._id ? <Spinner /> : <X />}
                                            </Button>
                                        </CardAction>
                                    </CardHeader>

                                    <SheetTrigger>
                                        <CardContent
                                            onClick={() => setSelectedTask(task)}
                                            className="cursor-pointer"
                                        >
                                            {task.body}
                                        </CardContent>
                                    </SheetTrigger>
                                </Card>
                            );
                        })}
                    </div>
                </ScrollArea>

                <TaskSheet task={selectedTask} />
            </Sheet>
        </>
    );
});

export default TasksGrid;
