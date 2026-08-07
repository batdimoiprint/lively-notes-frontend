import { LayoutGrid, CalendarDays, UserRound, Eye, EyeOff, GripVertical, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";

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
  const [position, setPosition] = useState({ x: 20, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const { theme, setTheme } = useTheme();

  const handlePointerDown = (e: React.PointerEvent) => {
    if (dragRef.current) {
      setIsDragging(true);
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      dragRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    
    const boundedX = Math.max(10, Math.min(window.innerWidth - 80, newX));
    const boundedY = Math.max(10, Math.min(window.innerHeight - 250, newY));
    
    setPosition({ x: boundedX, y: boundedY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (dragRef.current) {
      dragRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Adjust position if window resizes
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(window.innerWidth - 80, prev.x),
        y: Math.min(window.innerHeight - 250, prev.y),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Card
      ref={dragRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        touchAction: "none",
      }}
      className={`flex shrink-0 flex-col items-center justify-center gap-3 p-3 transition-shadow duration-300 w-16 select-none ${
        isDragging ? "shadow-2xl ring-2 ring-primary/50" : "shadow-lg"
      }`}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="flex h-6 w-full cursor-grab active:cursor-grabbing items-center justify-center text-muted-foreground/45 border-b pb-2 mb-1"
      >
        <GripVertical className="h-4 w-4 rotate-90" />
      </div>

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

      <div className="flex flex-col items-center gap-2 border-t pt-2 w-full mt-2">
        <Switch
          checked={hideHeaders}
          onCheckedChange={onHideHeadersChange}
          aria-label="Toggle headers visibility"
        />
        {hideHeaders ? (
          <EyeOff className="h-3 w-3 text-muted-foreground" />
        ) : (
          <Eye className="h-3 w-3 text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col items-center border-t pt-2 w-full mt-1">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0 relative z-[10000]"
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



