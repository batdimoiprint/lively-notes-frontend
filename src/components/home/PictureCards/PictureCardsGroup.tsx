import { useLizIds, useMomoIds, useSanaIds } from "@/lib/cloudinary";
import React from "react";
import PhotoCards from "./PhotoCards";

const PictureCards = React.memo(function PictureCards() {
  const { sanaImg, isLoading: isSanaLoading, error: sanaError } = useSanaIds();
  const { lizImg, isLoading: isLizLoading, error: lizError } = useLizIds();
  const { momoImg, isLoading: isMomoLoading, error: momoError } = useMomoIds();

  return (
    <>
      <PhotoCards
        cardLabel={"For my gf"}
        idolError={lizError}
        idolImg={lizImg}
        isIdolLoading={isLizLoading}
      />
      <PhotoCards
        cardLabel={"Fist Love"}
        idolError={momoError}
        idolImg={momoImg}
        isIdolLoading={isMomoLoading}
      />
      <PhotoCards
        cardLabel={"Happy Birthday <3"}
        idolError={sanaError}
        idolImg={sanaImg}
        isIdolLoading={isSanaLoading}
      />
    </>
  );
});

export default PictureCards;
