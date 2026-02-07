import { SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { type Inputs, type Tasks } from "@/types/tasktypes";
import { Save } from "lucide-react";
import { Button } from "../../ui/button";

import { editNotes } from "@/api/notes";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export default function TaskSheet({ task }: { task: Tasks | null }) {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [result, setResult] = useState<React.ReactNode>("Save");
  const queryClient = useQueryClient();
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
  }, [task, reset]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const payload: Tasks = { ...data, _id: task?._id ?? "" };
    mutation.mutate(payload);
  };

  return (
    <>
      <SheetContent side="left" className="p-8">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <SheetTitle className="w-full wrap-break-word whitespace-normal">
            <Textarea {...register("title", { required: "Title is required" })} />
          </SheetTitle>
          <SheetDescription className="h-full w-full wrap-break-word whitespace-break-spaces">
            <Textarea
              {...register("body", {
                required: "Title is required",
              })}
            />
          </SheetDescription>

          <Button disabled={mutation.isPending} type="submit">
            <Save />
            {result}
          </Button>
        </form>
      </SheetContent>
    </>
  );
}
