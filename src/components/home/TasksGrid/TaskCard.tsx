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
import { Check, Trash, X } from "lucide-react";
import { useState } from "react";

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
  const [confirming, setConfirming] = useState<boolean>(false);

  function deleteTask() {
    setDeletingId(task._id);
    mutation.mutate(task._id);
  }

  return (
    <>
      <Card
        key={task._id}
        className="p-2 overflow-hidden max-h-48"
        onClick={() => {
          setSelectedTask(task);
        }}
      >
        <SheetTrigger>
          <CardHeader>
            {/* {task._id} */}
            <Label className="font-bold w-48 overflow-hidden text-ellipsis whitespace-nowrap">
              {task.title}
            </Label>

            <CardAction>
              <span className="cursor-pointer" onClick={e => e.stopPropagation()}>
                {deletingId === task._id ? (
                  <Spinner />
                ) : confirming ? (
                  <div className="flex flex-row gap-2">
                        <Check
                        onClick={() => {
                            deleteTask();
                            setConfirming(false);
                        }}
                        className="  cursor-pointer inline"
                        />
                        <X
                        onClick={() => setConfirming(false)}
                        className=" cursor-pointer inline"
                        />
                  </div>
                ) : (
                  <Trash
                    onClick={() => setConfirming(true)}
                    className="cursor-pointer"
                  />
                )}
              </span>
            </CardAction>
          </CardHeader>
          <CardContent className="whitespace-break-spaces ">
            {task.body}
          </CardContent>
        </SheetTrigger>
      </Card>
    </>
  );
}
