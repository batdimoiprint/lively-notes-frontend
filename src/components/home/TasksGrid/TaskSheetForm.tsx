import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Inputs, type Tasks } from "@/types/tasktypes";
import { Save } from "lucide-react";
import { Button } from "../../ui/button";

import { editNotes } from "@/api/notes";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export default function TaskSheet({ task }: { task: Tasks | null }) {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const titleTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [result, setResult] = useState<React.ReactNode>("Save");
  const queryClient = useQueryClient();

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const mutation = useMutation({
    mutationFn: editNotes,
    onMutate: () => {
      setResult(<Spinner />);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setResult(
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}>
          Notes Updated!
        </span>
      );
      toast.info("Notes Update");
      setTimeout(() => {
        setResult("Save");
      }, 2000);
    },
    onError: () => {
      toast.error("Failed to update notes");
    },
  });

  useEffect(() => {
    reset({ title: task?.title ?? "", body: task?.body ?? "" });
    requestAnimationFrame(() => {
      resizeTextarea(titleTextareaRef.current);
      resizeTextarea(bodyTextareaRef.current);
    });
  }, [task, reset]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const payload: Tasks = { ...data, _id: task?._id ?? "" };
    mutation.mutate(payload);
  };

  const titleField = register("title", { required: "Title is required" });
  const bodyField = register("body", { required: "Title is required" });

  return (
    <>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0">
        <form className="flex max-h-[90vh] flex-col gap-4 p-6" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-white">Edit task</DialogTitle>
            <DialogDescription className="text-white/70">
              Update the title and body for this note.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-20 rounded-md border">
            <Textarea
              {...titleField}
              ref={(element) => {
                titleField.ref(element);
                titleTextareaRef.current = element;
              }}
              className="min-h-20 resize-none overflow-hidden border-0 bg-transparent shadow-none focus-visible:ring-0"
              onInput={(event) => resizeTextarea(event.currentTarget)}
            />
          </ScrollArea>

          <ScrollArea className="min-h-0 flex-1 rounded-md border">
            <Textarea
              {...bodyField}
              ref={(element) => {
                bodyField.ref(element);
                bodyTextareaRef.current = element;
              }}
              className="min-h-48 resize-none overflow-hidden border-0 bg-transparent whitespace-break-spaces shadow-none focus-visible:ring-0"
              onInput={(event) => resizeTextarea(event.currentTarget)}
            />
          </ScrollArea>

          <Button className="self-end" disabled={mutation.isPending} type="submit">
            <Save />
            {result}
          </Button>
        </form>
      </DialogContent>
    </>
  );
}
