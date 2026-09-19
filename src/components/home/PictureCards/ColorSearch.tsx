import { useState, useMemo, memo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchByColor } from "@/api/post";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";

const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUDINARY } });

interface ImageItem {
  public_id: string;
  cldImg: ReturnType<typeof cld.image>;
  fullUrl: string;
  score: number;
  matchedColor: string;
  postUrl: string;
  ownerUsername: string;
}

const MemoizedImage = memo(({ img }: { img: ImageItem }) => (
  <AdvancedImage
    cldImg={img.cldImg}
    className="h-full w-full rounded object-cover"
    plugins={[responsive()]}
  />
));

MemoizedImage.displayName = "MemoizedImage";

export default function ColorSearch() {
  const [colorInput, setColorInput] = useState<string>("#ff0000");
  const [activeHex, setActiveHex] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["colorSearch", activeHex, page],
    queryFn: () => searchByColor(activeHex.replace("#", ""), page, 20),
    enabled: !!activeHex,
  });

  const handleSearch = () => {
    setActiveHex(colorInput);
    setPage(1);
  };

  const images: ImageItem[] = useMemo(() => {
    if (!data?.images) return [];
    return data.images.map((img) => ({
      public_id: img.public_id,
      cldImg: cld
        .image(img.public_id)
        .format("auto")
        .quality("auto")
        .resize(auto().gravity(autoGravity()).width(600).height(600)),
      fullUrl: cld.image(img.public_id).toURL(),
      score: img.score,
      matchedColor: img.matchedColor,
      postUrl: img.postUrl,
      ownerUsername: img.ownerUsername,
    }));
  }, [data]);

  const handleDownload = useCallback(async (img: ImageItem) => {
    try {
      const response = await fetch(img.fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${img.ownerUsername}-${img.public_id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }, []);

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-xl border p-4 bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <h3 className="font-semibold text-lg shrink-0">Color Search</h3>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border-none bg-transparent p-0"
          />
          <Button onClick={handleSearch} className="gap-2" disabled={isFetching}>
            <Search size={16} />
            Search
          </Button>
        </div>
      </div>

      {activeHex && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {isLoading || isFetching ? (
              Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
              ))
            ) : images.length > 0 ? (
              images.map((img) => (
                <div
                  key={img.public_id}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-md border"
                  onClick={() => setSelectedImage(img)}
                >
                  <MemoizedImage img={img} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">View</span>
                  </div>
                  <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                    <div 
                      className="h-2 w-2 rounded-full border border-white/50" 
                      style={{ backgroundColor: img.matchedColor }} 
                    />
                    <span>{Math.round(img.score * 100)}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No images found for this color.
              </div>
            )}
          </div>

          {data && data.totalPages > 1 && (
             <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm font-medium">
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= data.totalPages || isFetching}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Full-screen Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="flex max-h-[95vh] w-[95vw] max-w-5xl flex-col gap-0 border-0 bg-black p-0 shadow-2xl">
          <div className="relative flex min-h-[60vh] flex-1 items-center justify-center overflow-hidden">
            {selectedImage && (
              <img
                src={selectedImage.fullUrl}
                alt={`Photo by ${selectedImage.ownerUsername}`}
                className="relative z-30 max-h-[80vh] w-full object-contain"
              />
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 bg-black/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <div 
                className="h-4 w-4 rounded-full border border-white/50" 
                style={{ backgroundColor: selectedImage?.matchedColor }} 
              />
              <span className="text-sm font-medium text-white/70">
                Score: {selectedImage ? Math.round(selectedImage.score * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => selectedImage && handleDownload(selectedImage)}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                aria-label="Download full resolution image"
              >
                <Download size={16} />
                Download
              </button>
              {selectedImage?.postUrl && (
                <a
                  href={selectedImage.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white/70 hover:text-white hover:underline"
                >
                  @{selectedImage.ownerUsername}
                </a>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
