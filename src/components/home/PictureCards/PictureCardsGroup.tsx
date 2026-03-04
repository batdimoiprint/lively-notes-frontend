import React from "react";
import { useQuery } from "@tanstack/react-query";
import PhotoCards from "./PhotoCards";
import { getPostTest, type IGPost } from "@/api/post";

const PictureCards = React.memo(function PictureCards() {
  const { data: post } = useQuery<IGPost | undefined>({
    queryKey: ["igPost"],
    queryFn: getPostTest,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  //TODO: Add CRUD for the IG usernames so dynamically adjust based on the api
  return (
    <>
      <PhotoCards post={post} />
    </>
  );
});

export default PictureCards;
