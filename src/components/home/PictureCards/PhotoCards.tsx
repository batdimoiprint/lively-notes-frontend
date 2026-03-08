import { type IGPost } from "@/api/post";
import { Card } from "@/components/ui/card";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { Heart } from "lucide-react";
import { useState, useMemo, memo, useCallback } from "react";

const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUDINARY } });

interface ImageItem {
  public_id: string;
  cldImg: ReturnType<typeof cld.image>;
}

const MemoizedImage = memo(({ img }: { img: ImageItem }) => (
  <AdvancedImage
    cldImg={img.cldImg}
    className="h-full w-full rounded object-cover"
    plugins={[responsive()]}
  />
));

MemoizedImage.displayName = "MemoizedImage";

export default function PhotoCards({ post }: { post?: IGPost }) {
  const [imageIndex, setImageIndex] = useState<number>(0);

  const images: ImageItem[] = useMemo(
    () =>
      post?.cloudinaryPics.map((pic) => ({
        public_id: pic.public_id,
        cldImg: cld
          .image(pic.public_id)
          .format("auto")
          .quality("auto")
          .resize(auto().gravity(autoGravity()).width(1500).height(1500)),
      })) ?? [],
    [post?.cloudinaryPics]
  );

  const imageCount = images.length;

  const nextImage = useCallback(() => {
    if (!imageCount) {
      return;
    }
    setImageIndex((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const previousImage = useCallback(() => {
    if (!imageCount) {
      return;
    }
    setImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  }, [imageCount]);

  return (
    <Card className="w-full sm:max-w-75 gap-0 p-2 text-center">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden">
        {/* Gradient Button */}
        <div className="absolute inset-0 z-10 flex">
          <button
            type="button"
            className="flex h-full w-1/2 items-center justify-center bg-linear-to-r from-black/40 via-black/10 to-transparent transition hover:from-black/60 hover:via-black/20"
            onClick={previousImage}
          ></button>
          <button
            type="button"
            className="flex h-full w-1/2 items-center justify-center bg-linear-to-l from-black/40 via-black/10 to-transparent transition hover:from-black/60 hover:via-black/20"
            onClick={nextImage}
          ></button>
        </div>
        <div className="absolute z-2 flex h-full w-full flex-col items-end justify-end px-2 font-bold">
          {imageIndex + 1 + "/" + imageCount}
        </div>
        {/* Image Array */}
        <div
          className="flex"
          style={{ transform: `translateX(${imageIndex * -100}%)`, transition: "transform 0.3s" }}
        >
          {images.map((img) => (
            <MemoizedImage key={img.public_id} img={img} />
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-1">
          <Heart size={24} />
          <p className="font-bold">{post?.likesCount?.toLocaleString() ?? 0}</p>
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
