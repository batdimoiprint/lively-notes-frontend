import React from "react";
import PhotoCards from "./PhotoCards";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { type IGPost, useIdolPosts } from "@/api/post";
import Controlcard from "./ControlCard";
import { useIgPostRefreshStream } from "@/hooks/useIgPostRefreshStream";

const PictureCards = React.memo(function PictureCards() {
  useIgPostRefreshStream();

  const { data: posts } = useIdolPosts();

  // Shuffled posts
  const [shuffledPosts, setShuffledPosts] = React.useState<IGPost[]>([]);

  const handleRandomize = React.useCallback(() => {
    if (!posts) return;
    const arr = [...posts];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledPosts(arr);
  }, [posts]);

  // Shuffle posts on posts change and every 10 minutes
  React.useEffect(() => {
    handleRandomize();
    const interval = setInterval(handleRandomize, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, [posts, handleRandomize]);

  const handleScrollLeft = React.useCallback(() => {
    const viewport = document
      .getElementById("picture-cards-scroll-container")
      ?.querySelector('[data-slot="scroll-area-viewport"]');
    if (viewport) {
      viewport.scrollBy({ left: -340, behavior: "smooth" });
    }
  }, []);

  const handleScrollRight = React.useCallback(() => {
    const viewport = document
      .getElementById("picture-cards-scroll-container")
      ?.querySelector('[data-slot="scroll-area-viewport"]');
    if (viewport) {
      viewport.scrollBy({ left: 340, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="flex min-h-[190px] w-full flex-col sm:flex-row sm:items-stretch">
      <ScrollArea id="picture-cards-scroll-container" className="flex flex-1 flex-row sm:h-full">
        <div className="flex h-full max-w-5xl flex-1 snap-x snap-mandatory flex-row gap-2">
          {shuffledPosts.length === 0 ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="flex w-44 shrink-0 flex-col gap-2 rounded-lg border p-2 shadow-xs">
                <Skeleton className="aspect-square w-full rounded-md" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex justify-between pt-1">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))
          ) : (
            shuffledPosts.map((post) => (
              <PhotoCards key={post._id} post={post} />
            ))
          )}
        </div>
      </ScrollArea>
      <Controlcard
        onScrollLeft={handleScrollLeft}
        onScrollRight={handleScrollRight}
        onRandomize={handleRandomize}
      />
    </div>
  );
});

export default PictureCards;
