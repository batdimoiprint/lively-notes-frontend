import { type IGPost } from "@/api/post";
import { Card } from "@/components/ui/card";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { Heart } from "lucide-react";
import { useState, useMemo, memo, useCallback, useEffect } from "react";

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

  // Randomize imageIndex on mount or when images change, and reshuffle every 10 minutes
  useEffect(() => {
    if (images.length > 0) {
      setImageIndex(Math.floor(Math.random() * images.length));
    }
    // Set up reshuffle timer
    const interval = setInterval(() => {
      if (images.length > 0) {
        setImageIndex(Math.floor(Math.random() * images.length));
      }
    }, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, [images.length]);

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
    <Card className="w-[85vw] max-w-[18rem] shrink-0 snap-start gap-0 p-2 text-center sm:w-[18rem] sm:flex-none">
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
      {/* Caption (truncated if too long) */}
      {post?.caption ? (
        <div className="mt-2 px-1">
          <p className="text-gray-700 dark:text-gray-300 text-xs line-clamp-2 overflow-hidden text-ellipsis">
            {post.caption}
          </p>
        </div>
      ) : null}
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
      </div>
    </Card>
  );
}
