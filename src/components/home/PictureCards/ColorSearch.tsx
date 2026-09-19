import { useState, useMemo, memo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchByColor } from "@/api/post";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { ChevronLeft, ChevronRight, Download, Search, Palette } from "lucide-react";

const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUDINARY } });

interface ImageItem {
  public_id: string;
  cldImg: ReturnType<typeof cld.image>;
  fullUrl: string;
  score: number;
  matchedColor: string;
  matchedPercentage: number;
  postUrl: string;
  ownerUsername: string;
  caption: string;
}

const MemoizedImage = memo(({ img }: { img: ImageItem }) => (
  <AdvancedImage
    cldImg={img.cldImg}
    className="h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
    plugins={[responsive()]}
  />
));

MemoizedImage.displayName = "MemoizedImage";

const PAGE_SIZE = 20;

export default function ColorSearch() {
  const [colorInput, setColorInput] = useState<string>("#ff3b30");
  const [hexText, setHexText] = useState<string>("#ff3b30");
  const [activeHex, setActiveHex] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["colorSearch", activeHex, page],
    queryFn: () => searchByColor(activeHex.replace("#", ""), page, PAGE_SIZE),
    enabled: !!activeHex,
    staleTime: 60000,
  });

  const handleColorChange = (newColor: string) => {
    setColorInput(newColor);
    setHexText(newColor);
  };

  const handleHexBlur = () => {
    let formatted = hexText.trim();
    if (!formatted.startsWith("#")) {
      formatted = `#${formatted}`;
    }
    if (/^#[0-9a-fA-F]{6}$/.test(formatted)) {
      setColorInput(formatted);
      setHexText(formatted);
    } else {
      setHexText(colorInput);
    }
  };

  const handleSearch = () => {
    let cleanHex = hexText.trim();
    if (!cleanHex.startsWith("#")) {
      cleanHex = `#${cleanHex}`;
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(cleanHex)) {
      cleanHex = colorInput;
    }
    setActiveHex(cleanHex);
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
      matchedPercentage: img.matchedPercentage,
      postUrl: img.postUrl,
      ownerUsername: img.ownerUsername,
      caption: img.caption,
    }));
  }, [data]);

  const handleDownload = useCallback(async (img: ImageItem) => {
    try {
      const response = await fetch(img.fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${img.ownerUsername}-${img.public_id.replace(/\//g, "-")}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }, []);

  return (
    <div className="flex h-full w-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      {/* Top Search Controls Bar */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-b p-3 sm:px-4">
        {/* Left: Title & Color Picker */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 mr-1">
            <Palette className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold tracking-tight hidden xs:inline">Color Search</h3>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border shadow-xs">
              <input
                type="color"
                value={colorInput}
                onChange={(e) => handleColorChange(e.target.value)}
                className="absolute -top-2 -left-2 h-12 w-12 cursor-pointer border-none bg-transparent p-0"
                aria-label="Pick color"
              />
            </div>

            <Input
              type="text"
              value={hexText}
              onChange={(e) => setHexText(e.target.value)}
              onBlur={handleHexBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="#ff0000"
              className="h-8 w-24 px-2 text-center text-xs font-mono"
            />

            <Button
              type="button"
              size="sm"
              onClick={handleSearch}
              disabled={isFetching}
              className="h-8 gap-1.5 px-3 text-xs"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search</span>
            </Button>
          </div>

          {activeHex && (
            <div className="flex items-center gap-1.5 rounded-full border bg-accent/40 px-2.5 py-0.5 text-xs text-muted-foreground">
              <span
                className="h-2.5 w-2.5 rounded-full border border-black/20 shadow-xs"
                style={{ backgroundColor: activeHex }}
              />
              <span className="font-mono text-[11px] font-medium">{activeHex}</span>
              {data && (
                <span className="border-l border-border pl-1.5 text-[11px]">
                  {data.total} {data.total === 1 ? "match" : "matches"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Top Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Page <span className="font-medium text-foreground">{page}</span> of{" "}
              <span className="font-medium text-foreground">{data.totalPages}</span>
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page >= data.totalPages || isFetching}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Results Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
        {!activeHex ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <div className="rounded-full bg-accent/50 p-3">
              <Palette className="h-6 w-6 text-primary/70" />
            </div>
            <p className="text-sm font-medium">No color selected yet</p>
            <p className="max-w-md text-xs text-muted-foreground/80">
              Pick a color in the bar above and click Search to find Instagram photos whose palettes match your chosen color.
            </p>
          </div>
        ) : isLoading || isFetching ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5 rounded-lg border p-1.5 shadow-xs">
                <Skeleton className="aspect-square w-full rounded-md" />
                <div className="flex items-center justify-between px-0.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {images.map((img) => (
                <div
                  key={img.public_id}
                  className="group relative flex aspect-square cursor-pointer flex-col overflow-hidden rounded-lg border bg-muted/20 shadow-xs transition-shadow duration-200 hover:shadow-md"
                  onClick={() => setSelectedImage(img)}
                >
                  <MemoizedImage img={img} />

                  {/* Hover overlay with 'View' */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                      View
                    </span>
                  </div>

                  {/* Matching color & score badge */}
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white shadow-xs backdrop-blur-xs">
                    <div
                      className="h-2 w-2 rounded-full border border-white/60 shadow-xs"
                      style={{ backgroundColor: img.matchedColor }}
                    />
                    <span>{Math.round(img.score * 100)}%</span>
                  </div>

                  {/* Owner username badge */}
                  <div className="absolute bottom-1.5 left-1.5 max-w-[80%] truncate rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white/90 backdrop-blur-xs">
                    @{img.ownerUsername}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <span className="text-xs font-medium text-muted-foreground">
                  Page {page} of {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages || isFetching}
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  className="gap-1 text-xs"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <p className="text-sm font-medium">No matching photos found</p>
            <p className="text-xs text-muted-foreground/80">
              Try picking another color or shade to find matching images.
            </p>
          </div>
        )}
      </div>

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
            <div className="flex items-center gap-2.5">
              <div
                className="h-4 w-4 rounded-full border border-white/50"
                style={{ backgroundColor: selectedImage?.matchedColor }}
              />
              <span className="text-sm font-medium text-white/80">
                Match Score: {selectedImage ? Math.round(selectedImage.score * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
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
