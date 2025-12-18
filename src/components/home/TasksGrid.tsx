import { Trash } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader } from "../ui/card";
// import React, { useEffect, useState } from "react"
import { deleteNotes, useNotes, } from "@/api/notes";
import type Tasks from "@/types/tasktypes";

import { Spinner } from "../ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function TasksGrid() {
    const { data: tasks = [], isLoading, error } = useNotes();
    const queryClient = useQueryClient()

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



    return (<>

        <div className="grid grid-cols-6 gap-4">

            {tasks.map((task: Tasks) => {
                return (

                    <Card key={task._id} className="p-2 overflow-hidden max-h-48 backdrop-blur-md dark:bg-card/20">
                        <CardHeader className="text-xl font-bold" >{task.title}
                            <CardAction>
                                <Trash onClick={() => {
                                    // deleteNotes(task._id) 
                                    mutation.mutate(task._id)

                                }} />
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            {task.body}
                        </CardContent>

                    </Card>)
            })
            }

        </div >
    </>
    )
}
