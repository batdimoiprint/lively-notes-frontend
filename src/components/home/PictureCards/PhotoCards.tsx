import { type IGPost } from "@/api/post";
import { Card } from "@/components/ui/card";
import { useCloudPics } from "@/hooks/useCloudPics";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function PhotoCards({ post }: { post?: IGPost }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalImages = post?.cloudinaryPics?.length ?? 0;

  useEffect(() => {
    setCurrentIndex(0);
  }, [post?._id]);

  const currentPublicId =
    totalImages > 0 ? (post?.cloudinaryPics[currentIndex % totalImages]?.public_id ?? "") : "";

  const image = useCloudPics({ id: currentPublicId });

  const goNext = () => {
    if (totalImages === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const goPrev = () => {
    if (totalImages === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  return (
    <Card className="w-full max-w-74.5 gap-0 p-2 text-center">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden">
        {image ? (
          <AdvancedImage
            cldImg={image}
            className="h-full w-full rounded object-cover"
            plugins={[responsive()]}
          />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
            No image available
          </div>
        )}

        {totalImages > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={goPrev}
              className="absolute top-0 left-0 z-10 flex h-full w-1/3 items-center justify-start bg-linear-to-r from-black/40 to-transparent px-2 text-white transition hover:from-black/60"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={goNext}
              className="absolute top-0 right-0 z-10 flex h-full w-1/3 items-center justify-end bg-linear-to-l from-black/40 to-transparent px-2 text-white transition hover:from-black/60"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {totalImages > 0 && (
          <div className="absolute right-2 bottom-2 z-10 rounded bg-black/60 px-2 py-1 text-xs text-white">
            {currentIndex + 1}/{totalImages}
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Heart size={24} />
          <p className="font-bold">{post?.likesCount}</p>
        </div>
        <a
          href={post?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer font-medium hover:font-bold hover:underline"
        >
          {post?.ownerUsername}
        </a>
        {/* <p className="font-bold">Caption</p> */}
      </div>
    </Card>
  );
}
