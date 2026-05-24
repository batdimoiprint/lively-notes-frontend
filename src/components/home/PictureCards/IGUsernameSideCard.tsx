import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
    <Card
      className={`relative flex h-[360px] w-full shrink-0 items-center justify-center overflow-hidden p-3 transition-all duration-300 sm:h-full ${open ? "sm:w-80" : "sm:w-16"}`}
    >
      {!open ? (
        <Button
          type="button"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={() => setOpen(true)}
          aria-label="Add IG Username"
        >
          <Plus />
        </Button>
      ) : (
        <div className="animate-in fade-in zoom-in-95 flex w-full flex-col gap-3 p-2 duration-200">
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
            className="h-10 w-full text-center"
          />
          <div className="flex w-full gap-2">
            <Button
              type="button"
              onClick={submit}
              disabled={mutation.isPending}
              className="h-9 flex-1"
            >
              {mutation.isPending ? <Spinner className="h-4 w-4" /> : "Add"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
              className="h-9 flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
