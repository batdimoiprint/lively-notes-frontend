import { LayoutGrid, CalendarDays, UserRound, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

export type ContentView = "notes" | "calendar" | "jobs";

interface ContentViewToggleProps {
  view: ContentView;
  onViewChange: (view: ContentView) => void;
  hideHeaders: boolean;
  onHideHeadersChange: (hide: boolean) => void;
}

export default function ContentViewToggle({
  view,
  onViewChange,
  hideHeaders,
  onHideHeadersChange,
}: ContentViewToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="flex flex-row items-center justify-between gap-3 p-3 w-full shadow-md select-none shrink-0 bg-card/60 backdrop-blur-md">
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
          <span className="hidden sm:inline text-xs font-semibold">Notes</span>
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
          <span className="hidden sm:inline text-xs font-semibold">Calendar</span>
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
          <span className="hidden sm:inline text-xs font-semibold">Jobs</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border-r pr-4 border-border">
          <span className="text-xs font-semibold text-muted-foreground hidden xs:inline">Headers Drawer</span>
          <Switch
            checked={!hideHeaders}
            onCheckedChange={(checked) => onHideHeadersChange(!checked)}
            aria-label="Toggle headers drawer"
          />
          {hideHeaders ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0 relative"
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




