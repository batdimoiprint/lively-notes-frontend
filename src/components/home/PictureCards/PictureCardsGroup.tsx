import React from "react";
import { useQuery } from "@tanstack/react-query";
import PhotoCards from "./PhotoCards";
import { getIdolPosts, type IGPost } from "@/api/post";
import IGUsernameSideCard from "./IGUsernameSideCard";

const PictureCards = React.memo(function PictureCards() {
  const { data: posts = [] } = useQuery<IGPost[]>({
    queryKey: ["igIdolPosts"],
    queryFn: getIdolPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
      <IGUsernameSideCard />
      <div className="flex w-full gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] snap-x snap-mandatory sm:overflow-visible sm:pb-0">
        {posts.map((post) => (
          <PhotoCards key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
});

export default PictureCards;
