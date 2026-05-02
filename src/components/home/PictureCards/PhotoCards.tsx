import { type IGPost, getRandomPostByUsername } from "@/api/post";
import { getIgUsernames, deleteIgUsername } from "@/api/igUsername";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { Heart, Dices, Trash2, Download } from "lucide-react";
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
  const [showImageDialog, setShowImageDialog] = useState(false);

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

  // Full-resolution images for the dialog (no resize = original quality)
  const fullResImages: ImageItem[] = useMemo(
    () =>
      currentPost?.cloudinaryPics.map((pic) => ({
        public_id: pic.public_id,
        cldImg: cld.image(pic.public_id).format("auto").quality("auto"),
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

  const handleDownload = useCallback(async () => {
    if (!currentPost || images.length === 0) return;
    try {
      const currentImage = images[imageIndex];
      const imageUrl = cld.image(currentImage.public_id).toURL();
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentPost.ownerUsername}-${imageIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }, [imageIndex, currentPost, images]);

  return (
    <>
      <Card className="w-[85vw] max-w-[18rem] shrink-0 snap-start gap-0 p-2 text-center sm:w-[18rem] sm:flex-none">
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden">
        {/* 3-zone overlay: prev | open dialog | next */}
        <div className="absolute inset-0 z-10 flex">
          <button
            type="button"
            aria-label="Previous image"
            className="flex h-full w-1/3 items-center justify-center bg-linear-to-r from-black/40 via-black/10 to-transparent transition hover:from-black/60 hover:via-black/20"
            onClick={previousImage}
          />
          <button
            type="button"
            aria-label="View full image"
            className="flex h-full w-1/3 cursor-zoom-in items-center justify-center transition hover:bg-white/10"
            onClick={() => setShowImageDialog(true)}
          />
          <button
            type="button"
            aria-label="Next image"
            className="flex h-full w-1/3 items-center justify-center bg-linear-to-l from-black/40 via-black/10 to-transparent transition hover:from-black/60 hover:via-black/20"
            onClick={nextImage}
          />
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
          <button
            onClick={handleDownload}
            className="hover:bg-accent rounded p-1"
            aria-label="Download image"
          >
            <Download size={16} />
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

    {/* Full-screen Image Dialog */}
    <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
      <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-5xl flex-col gap-0 border-0 bg-black p-0 shadow-2xl">
        {/* Image area */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
          {/* Navigation: prev */}
          <button
            onClick={previousImage}
            className="absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-lg bg-black/50 p-3 text-white transition hover:bg-black/80"
            aria-label="Previous image"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Navigation: next */}
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-lg bg-black/50 p-3 text-white transition hover:bg-black/80"
            aria-label="Next image"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image */}
          {fullResImages.length > 0 && (
            <AdvancedImage
              cldImg={fullResImages[imageIndex].cldImg}
              className="max-h-[80vh] w-full object-contain"
              plugins={[responsive()]}
            />
          )}
        </div>

        {/* Bottom controls bar */}
        <div className="flex shrink-0 items-center justify-between bg-black/80 px-4 py-3">
          {/* Counter */}
          <span className="text-sm font-medium text-white/70">
            {imageIndex + 1} / {imageCount}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              aria-label="Download full resolution image"
            >
              <Download size={16} />
              Download
            </button>
            <a
              href={currentPost?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/70 hover:text-white hover:underline"
            >
              @{currentPost?.ownerUsername}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
}
