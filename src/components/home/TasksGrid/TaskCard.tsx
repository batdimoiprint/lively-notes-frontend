import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { SheetTrigger } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import type { Tasks } from "@/types/tasktypes";
import { Label } from "@radix-ui/react-label";
import type { UseMutationResult } from "@tanstack/react-query";
import { X } from "lucide-react";

interface TaskCardProps {
    task: Tasks;
    deletingId: string | null;
    setDeletingId: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedTask: React.Dispatch<React.SetStateAction<Tasks | null>>;
    mutation: UseMutationResult<number | undefined, Error, string, unknown>;

}

export default function TaskCard({
    task,
    deletingId,
    mutation,
    setDeletingId,
    setSelectedTask,
}: TaskCardProps) {
    return (
        <>
            <Card
                key={task._id}
                className="p-2 overflow-hidden max-h-48 backdrop-blur-md dark:bg-card/20"
            >
                <SheetTrigger>
                    <CardHeader>
                        {/* {task._id} */}
                        <Label className="font-bold w-48 overflow-hidden text-ellipsis whitespace-nowrap">
                            {task.title}
                        </Label>

                        <CardAction>
                            <span
                                onClick={async (e) => {
                                    setDeletingId(task._id);
                                    mutation.mutate(task._id);
                                    e.stopPropagation();
                                }}
                                className="cursor-pointer"

                            >
                                {deletingId === task._id ? <Spinner /> : <X />}
                            </span>
                        </CardAction>
                    </CardHeader>
                    <CardContent
                        className="whitespace-break-spaces "
                        onClick={() => {
                            setSelectedTask(task);
                        }}
                    >
                        {task.body}
                    </CardContent>
                </SheetTrigger>
            </Card>
        </>
    );
}
