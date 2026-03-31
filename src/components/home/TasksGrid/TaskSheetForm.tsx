import { DialogContent } from "@/components/ui/dialog";
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
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [result, setResult] = useState<React.ReactNode>("Save");
  const queryClient = useQueryClient();

  const resizeTextarea = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
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
    <DialogContent className="max-h-[90vh] overflow-hidden p-0">
      <form className="flex max-h-[90vh] flex-col gap-4 p-6" onSubmit={handleSubmit(onSubmit)}>
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
        <Button className="self-end" disabled={mutation.isPending} type="submit">
          <Save />
          {result}
        </Button>
      </form>
    </DialogContent>
  );
}
