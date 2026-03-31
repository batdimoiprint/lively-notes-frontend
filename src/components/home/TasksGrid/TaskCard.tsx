import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { Tasks } from "@/types/tasktypes";
import { Label } from "@radix-ui/react-label";
import type { UseMutationResult } from "@tanstack/react-query";
import { Check, Trash, X, Save } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Textarea } from "@/components/ui/textarea";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editNotes } from "@/api/notes";
import { toast } from "sonner";
import { type Inputs } from "@/types/tasktypes";
import { useSettings } from "@/api/settings";

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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const { data: settings } = useSettings();

  const titleTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const editMutation = useMutation({
    mutationFn: editNotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.info("Notes Update");
      setIsExpanded(false);
    },
    onError: () => {
      toast.error("Failed to update notes");
    },
  });

  useEffect(() => {
    reset({ title: task.title, body: task.body });
    if (isExpanded) {
      setTimeout(() => {
        resizeTextarea(titleTextareaRef.current);
        resizeTextarea(bodyTextareaRef.current);
      }, 0);
    }
  }, [task, reset, isExpanded]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const payload: Tasks = { ...data, _id: task._id };
    editMutation.mutate(payload);
  };

  function deleteTask() {
    setDeletingId(task._id);
    mutation.mutate(task._id);
  }

  const titleField = register("title", { required: "Title is required" });
  const bodyField = register("body", { required: "Title is required" });

  const handleCardClick = () => {
    if (isDesktop) {
      setSelectedTask(task);
    } else {
      if (!isExpanded) setIsExpanded(true);
    }
  };

  return (
    <>
      <Card
        key={task._id}
        className={`${isExpanded ? "h-auto max-h-none border-2" : "max-h-48"} relative overflow-hidden p-2 transition-all`}
        style={isExpanded && settings?.textColor ? { borderColor: settings.textColor } : undefined}
        onClick={handleCardClick}
      >
        {!isExpanded || isDesktop ? (
          <>
            <CardHeader>
              <Label className="w-48 overflow-hidden font-bold text-ellipsis whitespace-nowrap">
                {task.title}
              </Label>
              <CardAction onClick={(e) => e.stopPropagation()}>
                <span className="cursor-pointer">
                  {deletingId === task._id ? (
                    <Spinner />
                  ) : confirming ? (
                    <div className="flex flex-row gap-2">
                      <Check
                        onClick={() => {
                          deleteTask();
                          setConfirming(false);
                        }}
                        className="inline cursor-pointer"
                      />
                      <X onClick={() => setConfirming(false)} className="inline cursor-pointer" />
                    </div>
                  ) : (
                    <Trash onClick={() => setConfirming(true)} className="cursor-pointer" />
                  )}
                </span>
              </CardAction>
            </CardHeader>
            <CardContent className="break-words whitespace-break-spaces">{task.body}</CardContent>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-2 p-1">
            <div className="mb-1 flex items-center justify-between">
              <Textarea
                {...titleField}
                className="text-md m-0 min-h-0 resize-none border-none bg-transparent p-0 font-bold focus-visible:ring-0"
                style={{ overflow: "hidden" }}
                onChange={(e) => {
                  titleField.onChange(e);
                  resizeTextarea(e.target);
                }}
                ref={(e) => {
                  titleField.ref(e);
                  titleTextareaRef.current = e;
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex shrink-0 gap-2">
                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className="rounded bg-transparent p-1"
                  style={{ color: settings?.textColor || "#22c55e" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {editMutation.isPending ? <Spinner /> : <Save size={18} />}
                </button>
                <X
                  className="cursor-pointer rounded p-1 text-gray-500"
                  size={26}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                />
              </div>
            </div>
            <Textarea
              {...bodyField}
              className="min-h-24 resize-none border-none bg-transparent p-0 text-sm whitespace-break-spaces focus-visible:ring-0"
              style={{ overflow: "hidden" }}
              onChange={(e) => {
                bodyField.onChange(e);
                resizeTextarea(e.target);
              }}
              ref={(e) => {
                bodyField.ref(e);
                bodyTextareaRef.current = e;
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </form>
        )}
      </Card>
    </>
  );
}
