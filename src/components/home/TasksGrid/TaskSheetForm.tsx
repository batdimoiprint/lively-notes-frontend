import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Inputs, type Tasks } from "@/types/tasktypes";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { editNotes } from "@/api/notes";

export default function TaskSheet({ task }: { task: Tasks | null }) {
  const { register, reset, watch } = useForm<Inputs>();
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<{ title: string; body: string }>({ title: "", body: "" });
  const latestValuesRef = useRef<{ title: string; body: string }>({ title: "", body: "" });
  const taskRef = useRef<Tasks | null>(task);
  const queryClient = useQueryClient();

  // Watch form values
  const titleValue = watch("title");
  const bodyValue = watch("body");

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const mutation = useMutation({
    mutationFn: editNotes,
    onSuccess: (_, variables) => {
      lastSavedRef.current = {
        title: variables.title,
        body: variables.body,
      };
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.info("Notes saved");
    },
    onError: () => {
      toast.error("Failed to update notes");
    },
  });

  const mutateRef = useRef<typeof mutation.mutate | null>(null);

  useEffect(() => {
    taskRef.current = task;
  }, [task]);

  useEffect(() => {
    mutateRef.current = mutation.mutate;
  }, [mutation.mutate]);

  useEffect(() => {
    if (!task?._id) return;

    const nextValues = {
      title: titleValue ?? "",
      body: bodyValue ?? "",
    };

    latestValuesRef.current = nextValues;

    if (
      nextValues.title === lastSavedRef.current.title &&
      nextValues.body === lastSavedRef.current.body
    ) {
      return;
    }

    if (!nextValues.title.trim()) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      mutation.mutate({
        ...task,
        title: nextValues.title,
        body: nextValues.body,
      });
    }, 1500);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [titleValue, bodyValue, task?._id]);

  // Debounced auto-save
  useEffect(() => {
    const nextTaskValues = {
      title: task?.title ?? "",
      body: task?.body ?? "",
    };

    lastSavedRef.current = nextTaskValues;
    latestValuesRef.current = nextTaskValues;
    reset(nextTaskValues);
    requestAnimationFrame(() => {
      resizeTextarea(bodyTextareaRef.current);
    });
  }, [task, reset]);

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      const { title, body } = latestValuesRef.current;
      const currentTask = taskRef.current;
      if (
        currentTask?._id &&
        title.trim() &&
        (title !== lastSavedRef.current.title || body !== lastSavedRef.current.body)
      ) {
        mutateRef.current?.({
          ...currentTask,
          title,
          body,
        });
      }
    };
  }, []);

  const titleField = register("title", { required: "Title is required" });
  const bodyField = register("body", { required: "Title is required" });

  return (
    <DialogContent className="max-h-[90vh] overflow-hidden p-0">
      <DialogTitle className="sr-only">Edit Task</DialogTitle>
      <div className="flex max-h-[90vh] flex-col gap-4 p-6">
        {/* Title input in header */}
        <div className="flex flex-col gap-2">
          <input
            {...titleField}
            ref={titleField.ref}
            className="border-none bg-transparent px-0 py-0 text-xl font-bold outline-none focus-visible:ring-0"
            placeholder="Title"
            defaultValue={task?.title ?? ""}
            autoFocus
          />
        </div>
        <ScrollArea className="min-h-0 flex-1 rounded-md border-none">
          <Textarea
            {...bodyField}
            ref={(element) => {
              bodyField.ref(element);
              bodyTextareaRef.current = element;
            }}
            className="min-h-48 resize-none overflow-hidden border-none bg-transparent whitespace-break-spaces focus-visible:ring-0"
            onInput={(event: React.FormEvent<HTMLTextAreaElement>) =>
              resizeTextarea(event.currentTarget)
            }
            placeholder="Body"
          />
        </ScrollArea>
      </div>
    </DialogContent>
  );
}
