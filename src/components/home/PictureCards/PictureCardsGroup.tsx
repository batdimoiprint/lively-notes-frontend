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
    <div className="flex w-full  items-stretch gap-2 ">
      <IGUsernameSideCard />
      {posts.map((post) => (
        <PhotoCards key={post._id} post={post} />
      ))}
    </div>
  );
});

export default PictureCards;
