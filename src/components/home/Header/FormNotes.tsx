import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { createNotes } from "@/api/notes";
import { type Inputs } from "@/types/tasktypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../../ui/spinner";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

export default function FormNotes() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const [result, setResult] = useState<React.ReactNode>("Submit");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNotes,
    onMutate: () => setResult(<Spinner />),
    onSuccess: () => {
      setResult(
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}>
          <Check size={16} /> Notes Created!
        </span>
      );
      reset();
      setTimeout(() => {
        setResult("Submit");
      }, 2000);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.info("Notes Created");
    },
    onError: (error) => {
      setResult(error.message);
      setTimeout(() => {
        setResult("Submit");
      }, 2000);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form className="flex h-full w-full flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("title", {
          required: "Title is required",
        })}
        placeholder={errors.title ? errors.title.message : "Title"}
      />

      {/* {errors.title && <Label >{errors.title.message}</Label>} */}
      <Textarea
        className="h-24 overflow-hidden"
        {...register("body", {
          required: "Body is required",
        })}
        placeholder={errors.body ? errors.body.message : "Body"}
      />
      {/* {errors.body && <Label >{errors.body.message}</Label>} */}

      <Button disabled={mutation.isPending} type="submit">
        {result}
      </Button>

      {errors.root && <Label>{errors.root.message}</Label>}
    </form>
  );
}
