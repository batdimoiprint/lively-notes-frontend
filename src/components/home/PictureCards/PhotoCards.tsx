import { type IGPost, getRandomPostByUsername } from "@/api/post";
import { getIgUsernames, deleteIgUsername } from "@/api/igUsername";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { Heart, Dices, Trash2 } from "lucide-react";
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

export default function PhotoCards({ post: initialPost }: { post?: IGPost }) {
  const [currentPost, setCurrentPost] = useState<IGPost | undefined>(initialPost);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const queryClient = useQueryClient();

  // Sync state if prop changes
  useEffect(() => {
    setCurrentPost(initialPost);
  }, [initialPost]);

  const { data: usernames } = useQuery({
    queryKey: ["igUsernames"],
    queryFn: getIgUsernames,
  });

  const randomizeMutation = useMutation({
    mutationFn: async () => {
      if (!currentPost?.ownerUsername) return null;
      return getRandomPostByUsername(currentPost.ownerUsername);
    },
    onSuccess: (newPost) => {
      if (newPost) {
        setCurrentPost(newPost);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!currentPost?.ownerUsername || !usernames) return;
      const userObj = usernames.find(
        (u) => u.igUsername.toLowerCase() === currentPost.ownerUsername.toLowerCase()
      );
      if (userObj) {
        await deleteIgUsername(userObj.autoIncrement);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["igIdolPosts"] });
      queryClient.invalidateQueries({ queryKey: ["igUsernames"] });
      setShowDeleteConfirm(false);
    },
    onError: () => {
      setShowDeleteConfirm(false);
    },
  });

  const images: ImageItem[] = useMemo(
    () =>
      currentPost?.cloudinaryPics.map((pic) => ({
        public_id: pic.public_id,
        cldImg: cld
          .image(pic.public_id)
          .format("auto")
          .quality("auto")
          .resize(auto().gravity(autoGravity()).width(1500).height(1500)),
      })) ?? [],
    [currentPost?.cloudinaryPics]
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
      {currentPost?.caption ? (
        <div className="mt-2 px-1">
          <p className="line-clamp-2 overflow-hidden text-xs text-ellipsis text-gray-700 dark:text-gray-300">
            {currentPost.caption}
          </p>
        </div>
      ) : null}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-1">
          <Heart size={24} />
          <p className="font-bold">{currentPost?.likesCount?.toLocaleString() ?? 0}</p>
        </div>
        <div className="flex items-center gap-2">
          {showDeleteConfirm ? (
            <>
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="hover:bg-accent rounded p-1"
                aria-label="Confirm delete"
              >
                {/* check icon */}
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="2" d="M4 8.5l3 3 5-5" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                }}
                disabled={deleteMutation.isPending}
                className="hover:bg-accent rounded p-1"
                aria-label="Cancel delete"
              >
                {/* cross icon */}
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="2" d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
              }}
              disabled={deleteMutation.isPending}
              className="hover:bg-accent rounded p-1"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={() => randomizeMutation.mutate()}
            disabled={randomizeMutation.isPending}
            className="hover:bg-accent rounded p-1"
          >
            <Dices size={16} />
          </button>
          <a
            href={currentPost?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer font-medium hover:font-bold hover:underline"
          >
            {currentPost?.ownerUsername}
          </a>
        </div>
      </div>
    </Card>
  );
}
