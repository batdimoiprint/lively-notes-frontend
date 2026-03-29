import React from "react";
import PhotoCards from "./PhotoCards";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type IGPost, useIdolPosts } from "@/api/post";
import IGUsernameSideCard from "./IGUsernameSideCard";
import { useIgPostRefreshStream } from "@/hooks/useIgPostRefreshStream";

const PictureCards = React.memo(function PictureCards() {
  useIgPostRefreshStream();

  const { data: posts = [] } = useIdolPosts();

  const [shuffledPosts, setShuffledPosts] = React.useState<IGPost[]>([]);

  // Shuffle posts on posts change and every 10 minutes
  React.useEffect(() => {
    function shuffleAndSet() {
      const arr = [...posts];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffledPosts(arr);
    }
    shuffleAndSet();
    const interval = setInterval(shuffleAndSet, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, [posts]);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
      <IGUsernameSideCard />
      <ScrollArea className="w-full max-w-5xl pb-2 sm:pb-0 ">
        <div className="flex gap-2 snap-x snap-mandatory ">
          {shuffledPosts.map((post) => (
            <PhotoCards key={post._id} post={post} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
});

export default PictureCards;
