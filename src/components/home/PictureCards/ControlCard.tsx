import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MoveLeft, MoveRight, Plus, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { createIgUsername } from "@/api/igUsername";
import { runActorForUsername } from "@/api/post";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ControlCardProps {
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  onRandomize?: () => void;
}

export default function ControlCard({ onScrollLeft, onScrollRight, onRandomize }: ControlCardProps) {
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
      className={`relative flex ${open ? "flex-col" : "flex-row sm:flex-col"} h-90 w-full shrink-0 items-center justify-center overflow-hidden p-3 transition-all duration-300 sm:h-full ${open ? "sm:w-80" : "sm:w-16"} gap-3`}
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
      <div className={`flex gap-2 ${open ? "flex-row w-full px-2" : "flex-row sm:flex-col"}`}>
        <Button
          type="button"
          size={open ? "default" : "icon"}
          variant="outline"
          onClick={onScrollLeft}
          className={open ? "h-10 flex-1" : "h-10 w-10 shrink-0 transition-transform duration-200 hover:scale-105"}
          aria-label="Scroll Left"
        >
          <MoveLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size={open ? "default" : "icon"}
          variant="outline"
          onClick={onRandomize}
          className={open ? "h-10 flex-1" : "h-10 w-10 shrink-0 transition-transform duration-200 hover:scale-105"}
          aria-label="Randomize Posts"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size={open ? "default" : "icon"}
          variant="outline"
          onClick={onScrollRight}
          className={open ? "h-10 flex-1" : "h-10 w-10 shrink-0 transition-transform duration-200 hover:scale-105"}
          aria-label="Scroll Right"
        >
          <MoveRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
