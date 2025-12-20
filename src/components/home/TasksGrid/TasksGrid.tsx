import { Trash } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader } from "../../ui/card";
// import React, { useEffect, useState } from "react"
import { deleteNotes, useNotes, } from "@/api/notes";
import { type Tasks } from "@/types/tasktypes";

import { Spinner } from "../../ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "../../ui/scroll-area";

import {
    Sheet,
    SheetTrigger,
} from "@/components/ui/sheet"
import TaskSheet from "./TaskSheetForm";
import React, { useState } from "react";

const TasksGrid = React.memo(function TasksGrid() {
    const { data: tasks = [], isLoading, error } = useNotes();
    const queryClient = useQueryClient()
    const [selectedTask, setSelectedTask] = useState<Tasks | null>(null)


    const mutation = useMutation({
        mutationFn: deleteNotes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] })

        },
        onError: (error) => {
            console.log(error)
        }
    })

    if (isLoading) return <Spinner />
    if (error) return <div>Error loading notes</div>



    return (
        <>
            <Sheet>
                <ScrollArea className="pb-4 h-180">
                    <div className="grid grid-cols-6 gap-4">
                        {tasks.map((task: Tasks) => {
                            return (
                                <Card key={task._id} className="p-2 overflow-hidden max-h-48 backdrop-blur-md dark:bg-card/20">
                                    <SheetTrigger>
                                        <CardHeader
                                            onClick={() => setSelectedTask(task)}
                                            className="text-xl font-bold cursor-pointer " >{task.title}

                                            <CardAction>

                                            </CardAction>
                                        </CardHeader>

                                    </SheetTrigger>
                                    <CardContent>
                                        <Trash onClick={

                                            async () => {
                                                const res = await deleteNotes(task._id)
                                                if (res == 200) {
                                                    mutation.mutate(task._id)

                                                }
                                            }}
                                        />
                                        {task.body}
                                    </CardContent>

                                </Card>)
                        })
                        }

                    </div >
                </ScrollArea>

                <TaskSheet task={selectedTask} />

            </Sheet>
        </>
    )
})

export default TasksGrid