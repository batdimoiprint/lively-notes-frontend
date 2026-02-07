import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AdvancedImage, responsive } from "@cloudinary/react";
import type { CloudinaryImage } from "@cloudinary/url-gen/index";

interface PhotoCardProps {
  isIdolLoading: boolean;
  idolImg: CloudinaryImage | null;
  idolError: Error | null;
  cardLabel: string;
}

export default function PhotoCards({
  isIdolLoading,
  idolImg,
  idolError,
  cardLabel,
}: PhotoCardProps) {
  return (
    <Card className="w-full max-w-74.5 gap-0 p-2 text-center">
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden">
        {isIdolLoading ? (
          <Spinner />
        ) : idolImg ? (
          <AdvancedImage
            cldImg={idolImg}
            className="h-full w-full rounded object-cover"
            plugins={[responsive()]}
          />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
            No image available
          </div>
        )}
        {idolError?.message}
      </div>
      <p className="font-bold">{cardLabel}</p>
    </Card>
  );
}
