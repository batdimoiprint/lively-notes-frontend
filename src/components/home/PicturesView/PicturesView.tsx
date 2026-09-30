import PictureCards from "@/components/home/PictureCards/PictureCardsGroup";
import ColorSearch from "@/components/home/PictureCards/ColorSearch";

interface PicturesViewProps {
  hideHeaders?: boolean;
}

export default function PicturesView({ hideHeaders = false }: PicturesViewProps) {
  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-3 overflow-hidden">
      {/* Top: Picture card collection */}
      <div
        className={`shrink-0 origin-top overflow-hidden transition-all duration-300 ${
          hideHeaders
            ? "pointer-events-none max-h-0 scale-y-0 opacity-0"
            : "max-h-[500px] scale-y-100 opacity-100"
        }`}
      >
        <PictureCards />
      </div>

      {/* Bottom: Color search with scrollable results & pagination */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ColorSearch />
      </div>
    </div>
  );
}
