import { LayoutGrid, CalendarDays, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type ContentView = "notes" | "calendar" | "jobs";

interface ContentViewToggleProps {
  view: ContentView;
  onViewChange: (view: ContentView) => void;
}

export default function ContentViewToggle({ view, onViewChange }: ContentViewToggleProps) {
  return (
    <Card className="flex w-full shrink-0 flex-row items-center justify-center gap-3 overflow-hidden p-3 transition-all duration-300 sm:h-full sm:w-16 sm:flex-col">
      <Button
        type="button"
        size="icon"
        variant={view === "notes" ? "default" : "outline"}
        className="h-10 w-10 shrink-0 transition-transform duration-200 hover:scale-105"
        onClick={() => onViewChange("notes")}
        aria-label="Notes view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={view === "calendar" ? "default" : "outline"}
        className="h-10 w-10 shrink-0 transition-transform duration-200 hover:scale-105"
        onClick={() => onViewChange("calendar")}
        aria-label="Calendar view"
      >
        <CalendarDays className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant={view === "jobs" ? "default" : "outline"}
        className="h-10 w-10 shrink-0 transition-transform duration-200 hover:scale-105"
        onClick={() => onViewChange("jobs")}
        aria-label="Jobs view"
      >
        <UserRound className="h-4 w-4" />
      </Button>
    </Card>
  );
}
