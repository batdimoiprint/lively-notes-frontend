import { useState, useMemo, useCallback, useEffect } from "react";
import {
  useCalendarNotes,
  createCalendarNote,
  deleteCalendarNote,
  type CalendarNote,
} from "@/api/calendarNotes";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  CalendarDays,
  Plus,
  Trash,
  Bell,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  initPushNotifications,
  subscribeToPush,
  isSubscribedToPush,
} from "@/lib/pushNotifications";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EMPTY_NOTES: CalendarNote[] = [];

interface CalendarDayData {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Date;
  dateKey: string;
  notes: CalendarNote[];
}

export default function NotesCalendar() {
  const { data: calendarNotes = EMPTY_NOTES, isLoading, error } = useCalendarNotes();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDayData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Init push notifications on mount
  useEffect(() => {
    initPushNotifications().then(() => {
      isSubscribedToPush().then(setPushSubscribed);
    });
  }, []);

  // Build a map of date -> notes
  const notesByDate = useMemo(() => {
    const map = new Map<string, CalendarNote[]>();
    for (const note of calendarNotes) {
      const existing = map.get(note.date) || [];
      existing.push(note);
      map.set(note.date, existing);
    }
    return map;
  }, [calendarNotes]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days: CalendarDayData[] = [];

    for (let i = startDow - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      const dateKey = formatDateKey(date);
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        date,
        dateKey,
        notes: notesByDate.get(dateKey) || [],
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDateKey(date);
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        date,
        dateKey,
        notes: notesByDate.get(dateKey) || [],
      });
    }

    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      const dateKey = formatDateKey(date);
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        date,
        dateKey,
        notes: notesByDate.get(dateKey) || [],
      });
    }

    return days;
  }, [year, month, notesByDate]);

  // Sync selected day with updated data
  useEffect(() => {
    if (selectedDay) {
      const updated = calendarDays.find(
        (d) => d.dateKey === selectedDay.dateKey
      );
      if (updated) setSelectedDay(updated);
    }
  }, [calendarDays, selectedDay]);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
    setSelectedDay(null);
    setShowForm(false);
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
    setSelectedDay(null);
    setShowForm(false);
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDay(null);
    setShowForm(false);
  }, []);

  const handleEnablePush = useCallback(async () => {
    const ok = await subscribeToPush();
    if (ok) {
      setPushSubscribed(true);
      toast.success("Push notifications enabled!");
    } else {
      toast.error("Could not enable push notifications");
    }
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading calendar notes</div>;

  return (
    <div className="flex flex-1 flex-col gap-4 lg:flex-row">
      {/* Calendar Grid */}
      <Card className="flex flex-1 flex-col">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-primary h-5 w-5" />
            <CardTitle className="text-base">
              {MONTH_NAMES[month]} {year}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={goToPrevMonth}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col px-3 pb-3">
          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 gap-px">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="text-muted-foreground py-1 text-center text-[10px] font-semibold uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid flex-1 grid-cols-7 gap-px">
            {calendarDays.map((dayData, idx) => {
              const isSelected =
                selectedDay &&
                selectedDay.dateKey === dayData.dateKey;
              const hasNotes = dayData.notes.length > 0;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedDay(dayData);
                    setShowForm(false);
                  }}
                  className={`group relative flex min-h-[2.5rem] flex-col items-center justify-start rounded-lg p-1 text-xs transition-all duration-150 sm:min-h-[3.5rem] ${
                    !dayData.isCurrentMonth
                      ? "text-muted-foreground/40"
                      : "text-foreground"
                  } ${
                    dayData.isToday
                      ? "bg-primary/10 ring-primary/30 font-bold ring-1"
                      : ""
                  } ${
                    isSelected
                      ? "bg-primary text-primary-foreground ring-primary ring-2"
                      : "hover:bg-accent/60"
                  }`}
                >
                  <span
                    className={`text-[11px] leading-tight ${
                      dayData.isToday && !isSelected ? "text-primary" : ""
                    }`}
                  >
                    {dayData.day}
                  </span>
                  {hasNotes && (
                    <div className="mt-0.5 flex items-center gap-0.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-primary-foreground" : "bg-primary"
                        }`}
                      />
                      {dayData.notes.length > 1 && (
                        <span
                          className={`text-[8px] font-medium ${
                            isSelected
                              ? "text-primary-foreground"
                              : "text-primary"
                          }`}
                        >
                          {dayData.notes.length}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Side panel */}
      <Card className="flex w-full flex-col lg:w-80">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {selectedDay
              ? formatDisplayDate(selectedDay.date)
              : "Select a day"}
          </CardTitle>
          {selectedDay && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowForm((v) => !v)}
              title="Add note"
            >
              {showForm ? (
                <X className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 pb-3">
          {/* Create note form */}
          {showForm && selectedDay && (
            <CreateCalendarNoteForm
              dateKey={selectedDay.dateKey}
              onDone={() => setShowForm(false)}
              pushSubscribed={pushSubscribed}
              handleEnablePush={handleEnablePush}
            />
          )}

          {/* Notes list */}
          <ScrollArea className="flex-1">
            {selectedDay ? (
              selectedDay.notes.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {selectedDay.notes.map((note) => (
                    <CalendarNoteCard key={note._id} note={note} />
                  ))}
                </div>
              ) : (
                !showForm && (
                  <div className="text-muted-foreground flex flex-col items-center gap-2 pt-8 text-center">
                    <CalendarDays className="h-8 w-8 opacity-30" />
                    <p className="text-xs">No notes for this day</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7 gap-1 text-xs"
                      onClick={() => setShowForm(true)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add note
                    </Button>
                  </div>
                )
              )
            ) : (
              <div className="text-muted-foreground flex flex-col items-center gap-2 pt-8 text-center">
                <CalendarDays className="h-8 w-8 opacity-30" />
                <p className="text-xs">Click a day to see notes</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Create Note Form ────────────────────────────────────────────────────

function CreateCalendarNoteForm({
  dateKey,
  onDone,
  pushSubscribed,
  handleEnablePush,
}: {
  dateKey: string;
  onDone: () => void;
  pushSubscribed: boolean;
  handleEnablePush: () => Promise<void>;
}) {
  const initialDate = useMemo(() => {
    if (!dateKey) return undefined;
    const [y, m, d] = dateKey.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [dateKey]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [reminderDate, setReminderDate] = useState<Date | undefined>();
  const [reminderTime, setReminderTime] = useState<string>("12:00");
  const [reminderInterval, setReminderInterval] = useState<string>("once");
  const [isWholeDay, setIsWholeDay] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const queryClient = useQueryClient();

  // Reset states on day change
  useEffect(() => {
    setTitle("");
    setBody("");
    setReminderDate(undefined);
    setReminderTime("12:00");
    setReminderInterval("once");
    setIsWholeDay(false);
    setShowCustomDate(false);
  }, [dateKey]);

  const mutation = useMutation({
    mutationFn: createCalendarNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarNotes"] });
      toast.success("Calendar note created");
      setTitle("");
      setBody("");
      setReminderDate(undefined);
      setReminderTime("12:00");
      setReminderInterval("once");
      setIsWholeDay(false);
      setShowCustomDate(false);
      onDone();
    },
    onError: () => {
      toast.error("Failed to create calendar note");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    let reminderAtISO: string | null = null;
    if (reminderDate) {
      const combined = new Date(reminderDate);
      if (isWholeDay) {
        // Set all-day reminder to 9:00 AM on that day
        combined.setHours(9);
        combined.setMinutes(0);
      } else {
        const [hours, minutes] = reminderTime.split(":").map(Number);
        combined.setHours(hours);
        combined.setMinutes(minutes);
      }
      combined.setSeconds(0);
      combined.setMilliseconds(0);
      reminderAtISO = combined.toISOString();
    }

    mutation.mutate({
      title: title.trim(),
      body: body.trim(),
      date: dateKey,
      reminderAt: reminderAtISO,
      reminderInterval: reminderInterval,
      isWholeDay: isWholeDay,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-accent/30 flex flex-col gap-2 rounded-lg p-3"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="h-8 text-sm"
        autoFocus
      />
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Note body (optional)"
        className="min-h-[60px] resize-none text-sm"
      />

      <div className="flex flex-col gap-2 pt-1 border-t border-accent/20">
        <div className="flex items-center gap-1.5">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-8 flex-1 justify-start text-left font-normal text-xs px-2 gap-1.5 border-input bg-background/60 backdrop-blur-md hover:bg-background/80",
                  !reminderDate && "text-muted-foreground"
                )}
                onClick={() => {
                  if (!reminderDate) {
                    setReminderDate(initialDate);
                    setShowCustomDate(false);
                  }
                }}
              >
                <Bell className="h-3.5 w-3.5 shrink-0" />
                {reminderDate ? (
                  <span className="truncate">
                    {format(reminderDate, "MMM d, yyyy")} {isWholeDay ? "(Whole Day)" : `at ${reminderTime}`}
                  </span>
                ) : (
                  <span>Set reminder (optional)</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 flex flex-col gap-2 bg-popover/80 backdrop-blur-md border border-border/40 shadow-lg" align="start">
              {showCustomDate ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-accent/20 pb-1">
                    <span className="text-[11px] font-semibold">Select Date</span>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-6 px-1.5 text-[10px] text-primary"
                      onClick={() => {
                        setReminderDate(initialDate);
                        setShowCustomDate(false);
                      }}
                    >
                      Use note date
                    </Button>
                  </div>
                  <Calendar
                    mode="single"
                    selected={reminderDate}
                    onSelect={(d) => {
                      if (d) setReminderDate(d);
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 py-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Date: {reminderDate ? format(reminderDate, "MMM d, yyyy") : "None"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-6 px-1.5 text-[10px] text-primary"
                      onClick={() => setShowCustomDate(true)}
                    >
                      Change date
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 border-t border-accent/20 pt-2">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isWholeDay}
                      onChange={(e) => setIsWholeDay(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                    />
                    Whole Day
                  </label>
                </div>

                {!isWholeDay && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-muted-foreground">Time:</span>
                    <Input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="h-8 w-28 text-xs bg-background/50 border-input"
                    />
                  </div>
                )}

                {reminderDate && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-destructive mt-1 border border-destructive/20 hover:bg-destructive/10"
                    onClick={() => {
                      setReminderDate(undefined);
                      setShowCustomDate(false);
                    }}
                  >
                    Clear Reminder
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {reminderDate && (
          <div className="flex items-center justify-between gap-2 pl-1">
            <span className="text-[11px] text-muted-foreground font-medium shrink-0">Repeat:</span>
            <Select value={reminderInterval} onValueChange={setReminderInterval}>
              <SelectTrigger className="h-8 text-xs flex-1 justify-between px-2 bg-background border-input">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once (No Repeat)</SelectItem>
                <SelectItem value="5m">Every 5 minutes</SelectItem>
                <SelectItem value="15m">Every 15 minutes</SelectItem>
                <SelectItem value="30m">Every 30 minutes</SelectItem>
                <SelectItem value="1h">Every hour</SelectItem>
                <SelectItem value="1d">Every day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {!pushSubscribed && reminderDate && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-[10px] text-amber-600 border-amber-200/50 bg-amber-500/10 hover:bg-amber-500/20 hover:text-amber-700 w-full font-medium"
            onClick={handleEnablePush}
          >
            🔔 Enable notifications to receive alerts
          </Button>
        )}
      </div>

      <div className="flex gap-2 mt-1">
        <Button
          type="submit"
          size="sm"
          className="h-8 flex-1 text-xs"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Spinner className="h-3 w-3" /> : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={onDone}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ── Note Card ───────────────────────────────────────────────────────────

function CalendarNoteCard({ note }: { note: CalendarNote }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCalendarNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarNotes"] });
      toast.info("Calendar note deleted");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  return (
    <div className="bg-accent/50 group flex flex-col gap-1.5 rounded-lg p-3 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <FileText className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="text-sm font-medium leading-tight">
            {note.title}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => deleteMutation.mutate(note._id)}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? (
            <Spinner className="h-3 w-3" />
          ) : (
            <Trash className="h-3 w-3" />
          )}
        </Button>
      </div>
      {note.body && (
        <p className="text-muted-foreground pl-5 text-xs leading-relaxed">
          {note.body}
        </p>
      )}
      {note.reminderAt && (
        <div className="flex flex-col gap-0.5 pl-5">
          <div className="flex items-center gap-1">
            <Bell className="h-3 w-3 text-amber-500 shrink-0" />
            <span className="text-[10px] text-amber-500 font-medium">
              {note.isWholeDay ? (
                <span>
                  {new Date(note.reminderAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  (Whole Day)
                </span>
              ) : (
                new Date(note.reminderAt).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              )}
              {note.reminderInterval === "once" && note.reminderSent && " ✓"}
            </span>
          </div>
          {note.reminderInterval && note.reminderInterval !== "once" && (
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider pl-4">
              🔁 {getFrequencyLabel(note.reminderInterval)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function getFrequencyLabel(interval: string): string {
  switch (interval) {
    case "5m":
      return "Every 5 minutes";
    case "15m":
      return "Every 15 minutes";
    case "30m":
      return "Every 30 minutes";
    case "1h":
      return "Every hour";
    case "1d":
      return "Every day";
    default:
      return "Once";
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
