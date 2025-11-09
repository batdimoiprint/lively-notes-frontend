import { RefreshCcwIcon, Trash } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader } from "../ui/card";
// import React, { useEffect, useState } from "react"
import { deleteNotes, useNotes, } from "@/api/notes";
import type Tasks from "@/types/tasktypes";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";






export default function TasksGrid() {
    const { data: tasks = [], isLoading, error, refetch } = useNotes();

    if (isLoading) return <Spinner />
    if (error) return <div>Error loading notes</div>

    function handleRefresh() {
        refetch()
    }

    return (<>
        <Button variant={"secondary"} onClick={handleRefresh}><RefreshCcwIcon /></Button >
        <div className="grid grid-cols-6 gap-4">

            {tasks.map((task: Tasks) => {
                return (

                    <Card key={task._id} className="p-2 max-h-48 overflow-hidden">
                        <CardHeader className="font-bold text-xl" >{task.title}
                            <CardAction>
                                <Trash onClick={() => { deleteNotes(task._id) }} />
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
