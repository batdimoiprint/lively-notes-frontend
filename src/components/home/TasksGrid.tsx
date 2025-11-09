import { Trash } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader } from "../ui/card"
import React, { useEffect, useState } from "react"
import { getNotes } from "@/api/notes"


export default function TasksGrid() {
    type Tasks = {
        _id: number;
        title: string;
        body: string;
    };
    const [tasks, setTasks] = useState<Tasks[] | React.ReactNode>([])
    const [isDeleted, setDeleted] = useState<boolean>(false)


    useEffect(() => {
        async function fetchNotes() {
            const notes = await getNotes();
            setTasks(notes || []);
        }

        fetchNotes();
        setDeleted(false);
    }, [isDeleted]);


    async function deleteNote(id: number) {
        try {
            const response = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/notes/`, {
                headers: { "Content-Type": "application/json" },
                method: "DELETE",
                body: JSON.stringify({ _id: (id) })
            })

            setDeleted(true)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            await response.json()

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="grid grid-cols-6 gap-4">
            {tasks.map((task: Tasks) => {
                return (

                    <Card key={task._id} className="p-2 max-h-48 overflow-hidden">
                        <CardHeader className="font-bold text-xl" >{task.title}
                            <CardAction onClick={() => { deleteNote(task._id) }}>
                                <Trash />
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            {task.body}
                        </CardContent>

                    </Card>)
            })
            }

        </div >
    )
}
