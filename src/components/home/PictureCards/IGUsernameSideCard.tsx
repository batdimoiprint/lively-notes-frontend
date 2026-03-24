import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createIgUsername } from "@/api/igUsername";
import { runActorForUsername } from "@/api/post";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function IGUsernameSideCard() {
  const [open, setOpen] = useState(false);
  const [igUsername, setIgUsername] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (username: string) => {
      const normalized = username.trim().toLowerCase();
      await createIgUsername(normalized);
      await runActorForUsername(normalized);
      return normalized;
    },
    onSuccess: async () => {
      setIgUsername("");
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["igIdolPosts"] });
      toast.success("IG posts updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add ig username");
    },
  });

  const submit = () => {
    if (!igUsername.trim()) {
      toast.error("igUsername is required");
      return;
    }

    mutation.mutate(igUsername);
  };

  return (
    <Card className="relative flex h-full w-16 shrink-0 items-center justify-center overflow-visible p-2">
      {!open ? (
        <Button
          type="button"
          size="icon"
          className="h-10 w-10"
          onClick={() => setOpen(true)}
          aria-label="Add IG Username"
        >
          <Plus />
        </Button>
      ) : (
        <>
          <div className="absolute flex justify-between gap-2 left-1/2 top-1/2 z-20 w-52 -translate-x-1/2 -translate-y-1/2 -rotate-90 ">
            <Input
              value={igUsername}
              onChange={(event) => setIgUsername(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submit();
                }
              }}
              placeholder="ig-username"
              disabled={mutation.isPending}
              
            />

                        <Button
              type="button"
              size="sm"
              onClick={submit}
              disabled={mutation.isPending}
              className="h-8"
            >
              {mutation.isPending ? <Spinner /> : "Add"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
              className="h-8"
            >
              Close
            </Button>
          </div>

      
        </>
      )}
    </Card>
  );
}
