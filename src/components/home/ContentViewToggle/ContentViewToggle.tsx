import {
  LayoutGrid,
  CalendarDays,
  UserRound,
  Images,
  Eye,
  EyeOff,
  Sun,
  Moon,
  SquarePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

export type ContentView = "notes" | "calendar" | "jobs" | "pictures";

interface ContentViewToggleProps {
  view: ContentView;
  onViewChange: (view: ContentView) => void;
  hideHeaders: boolean;
  onHideHeadersChange: (hide: boolean) => void;
  onOpenQuickCapture?: () => void;
}

export default function ContentViewToggle({
  view,
  onViewChange,
  hideHeaders,
  onHideHeadersChange,
  onOpenQuickCapture,
}: ContentViewToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="bg-card/60 flex w-full shrink-0 flex-row items-center justify-between gap-3 p-3 shadow-md backdrop-blur-md select-none">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          variant={view === "notes" ? "default" : "outline"}
          className="h-9 gap-1.5 px-3 transition-transform duration-200 hover:scale-105"
          onClick={() => onViewChange("notes")}
          aria-label="Notes view"
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden text-xs font-semibold sm:inline">Notes</span>
        </Button>
        <Button
          type="button"
          size="sm"
          variant={view === "calendar" ? "default" : "outline"}
          className="h-9 gap-1.5 px-3 transition-transform duration-200 hover:scale-105"
          onClick={() => onViewChange("calendar")}
          aria-label="Calendar view"
        >
          <CalendarDays className="h-4 w-4" />
          <span className="hidden text-xs font-semibold sm:inline">Calendar</span>
        </Button>
        <Button
          type="button"
          size="sm"
          variant={view === "jobs" ? "default" : "outline"}
          className="h-9 gap-1.5 px-3 transition-transform duration-200 hover:scale-105"
          onClick={() => onViewChange("jobs")}
          aria-label="Jobs view"
        >
          <UserRound className="h-4 w-4" />
          <span className="hidden text-xs font-semibold sm:inline">Jobs</span>
        </Button>
        <Button
          type="button"
          size="sm"
          variant={view === "pictures" ? "default" : "outline"}
          className="h-9 gap-1.5 px-3 transition-transform duration-200 hover:scale-105"
          onClick={() => onViewChange("pictures")}
          aria-label="Pictures view"
        >
          <Images className="h-4 w-4" />
          <span className="hidden text-xs font-semibold sm:inline">Pictures</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {onOpenQuickCapture && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-9 gap-1.5 px-3 transition-transform duration-200 hover:scale-105"
            onClick={onOpenQuickCapture}
            aria-label="Quick capture sudden note (Super+N)"
            title="Quick Capture (Super + N)"
          >
            <SquarePen className="h-4 w-4" />
            <span className="hidden text-xs font-semibold sm:inline">Quick Note</span>
            <kbd className="text-muted-foreground ml-0.5 hidden text-[10px] lg:inline">⌘N</kbd>
          </Button>
        )}

        <div className="border-border flex items-center gap-2 border-r pr-4">
          <span className="text-muted-foreground xs:inline hidden text-xs font-semibold">
            Headers Drawer
          </span>
          <Switch
            checked={!hideHeaders}
            onCheckedChange={(checked) => onHideHeadersChange(!checked)}
            aria-label="Toggle headers drawer"
          />
          {hideHeaders ? (
            <EyeOff className="text-muted-foreground h-4 w-4" />
          ) : (
            <Eye className="text-muted-foreground h-4 w-4" />
          )}
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="relative h-9 w-9 shrink-0"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-yellow-500" />
          ) : (
            <Moon className="h-4 w-4 text-slate-800" />
          )}
        </Button>
      </div>
    </Card>
  );
}
