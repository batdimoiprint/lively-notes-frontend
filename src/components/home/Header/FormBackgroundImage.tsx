import { uploadBackgroundImage } from "@/api/backgroundImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useMutation } from "@tanstack/react-query";
import { Check, ShuffleIcon, UploadCloud } from "lucide-react";
import { useState, useContext } from "react";
import { toast } from "sonner";
import { BackgroundContext } from "@/context/BackgroundContext";

export default function FormBackgroundImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const backgroundContext = useContext(BackgroundContext);

  const mutation = useMutation({
    mutationFn: uploadBackgroundImage,
    onSuccess: () => {
      toast.success("Background image uploaded");
      setSelectedFile(null);
      window.dispatchEvent(new Event("background-image-updated"));
    },
    onError: () => {
      toast.error("Failed to upload background image");
    },
  });

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Input
        id="background-image"
        type="file"
        accept="image/jpeg, image/png, image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          setSelectedFile(file);
        }}
        className="cursor-pointer"
      />
      <Button
        type="button"
        disabled={!selectedFile || mutation.isPending}
        onClick={() => {
          if (!selectedFile) {
            return;
          }

          mutation.mutate(selectedFile);
        }}
      >
        {mutation.isSuccess ? <Check size={16} /> : <UploadCloud size={16} />}
      </Button>
      <Button
        onClick={() => {
          if (backgroundContext) {
            backgroundContext.reloadBackground();
          }
        }}
      >
        <ShuffleIcon />
      </Button>
    </div>
  );
}
