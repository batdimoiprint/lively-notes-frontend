import { Trash } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader } from "../ui/card";
// import React, { useEffect, useState } from "react"
import { deleteNotes, useNotes, } from "@/api/notes";
import type Tasks from "@/types/tasktypes";

import { Spinner } from "../ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "../ui/scroll-area";

import {
    Sheet,
    SheetTrigger,
} from "@/components/ui/sheet"
import TaskSheet from "./TaskSheet";
import { useState } from "react";

export default function TasksGrid() {
    const { data: tasks = [], isLoading, error } = useNotes();
    const queryClient = useQueryClient()
    // const [notesId, setNotesId] = useState<number>()
    const [title, setTitle] = useState<string>()
    const [body, setBody] = useState<string>()

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
                <ScrollArea className="h-150">
                    <div className="grid grid-cols-6 gap-4">

                        {tasks.map((task: Tasks) => {
                            return (

                                <Card key={task._id} className="p-2 overflow-hidden max-h-48 backdrop-blur-md dark:bg-card/20">
                                    <SheetTrigger>
                                        <CardHeader
                                            onClick={() => {
                                                // setNotesId(task._id)
                                                setTitle(task.title)
                                                setBody(task.body)

                                            }}
                                            className="text-xl font-bold cursor-pointer " >{task.title}

                                            <CardAction>
                                                <Trash onClick={() => {
                                                    // deleteNotes(task._id) 
                                                    if (typeof task._id === "number") {
                                                        mutation.mutate(task._id)
                                                    }
                                                }} />
                                            </CardAction>
                                        </CardHeader>
                                    </SheetTrigger>
                                    <CardContent>
                                        {task.body}
                                    </CardContent>

                                </Card>)
                        })
                        }

                    </div >
                </ScrollArea>

                <TaskSheet
                    // _id={notesId} 
                    title={title ?? ""} body={body ?? ""} />

            </Sheet>
        </>
    )
}
