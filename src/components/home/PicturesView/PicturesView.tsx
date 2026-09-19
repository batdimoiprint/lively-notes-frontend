import PictureCards from "@/components/home/PictureCards/PictureCardsGroup";
import ColorSearch from "@/components/home/PictureCards/ColorSearch";

export default function PicturesView() {
  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden gap-3">
      {/* Top: Picture card collection */}
      <div className="shrink-0">
        <PictureCards />
      </div>

      {/* Bottom: Color search with scrollable results & pagination */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ColorSearch />
      </div>
    </div>
  );
}
