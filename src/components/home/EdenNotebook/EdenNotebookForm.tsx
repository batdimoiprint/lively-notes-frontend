import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { type EdenNotebookEntry } from "./edenNotebookData";
import {
  CheckCircle2,
  ListTodo,
  AlertTriangle,
  FileText,
  Sparkles,
  X,
  PlusCircle,
  Save,
} from "lucide-react";

interface EdenNotebookFormProps {
  initialData?: EdenNotebookEntry | null;
  onSave: (data: {
    title: string;
    date: string;
    whatIdidLastWorkday: string;
    whatIWillDoToday: string;
    blockers: string;
    notes?: string;
  }) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

function getTodayFormatted() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultTitle(dateStr: string) {
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      const y = parts[0].slice(-2);
      return `TASKS ${m}-${d}-${y}`;
    }
  } catch {
    // fallback
  }
  return `TASKS ${dateStr}`;
}

export default function EdenNotebookForm({
  initialData,
  onSave,
  onCancel,
  isEditing = false,
}: EdenNotebookFormProps) {
  const [date, setDate] = useState<string>(initialData?.date || getTodayFormatted());
  const [title, setTitle] = useState<string>(
    initialData?.title || getDefaultTitle(getTodayFormatted())
  );
  const [whatIdidLastWorkday, setWhatIdidLastWorkday] = useState<string>(
    initialData?.whatIdidLastWorkday || ""
  );
  const [whatIWillDoToday, setWhatIWillDoToday] = useState<string>(
    initialData?.whatIWillDoToday || ""
  );
  const [blockers, setBlockers] = useState<string>(initialData?.blockers || "None");
  const [notes, setNotes] = useState<string>(initialData?.notes || "");
  const [showNotes, setShowNotes] = useState<boolean>(Boolean(initialData?.notes));

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setTitle(initialData.title);
      setWhatIdidLastWorkday(initialData.whatIdidLastWorkday);
      setWhatIWillDoToday(initialData.whatIWillDoToday);
      setBlockers(initialData.blockers);
      setNotes(initialData.notes || "");
      setShowNotes(Boolean(initialData.notes));
    }
  }, [initialData]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    // If user hasn't heavily customized the title, auto-sync it with the new date
    if (!initialData || title.startsWith("TASKS ") || title.startsWith("TASK ")) {
      setTitle(getDefaultTitle(newDate));
    }
  };

  const handleApplyTemplate = () => {
    if (!whatIdidLastWorkday) {
      setWhatIdidLastWorkday("• \n• ");
    }
    if (!whatIWillDoToday) {
      setWhatIWillDoToday("• \n• ");
    }
    if (!blockers || blockers === "") {
      setBlockers("None");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatIdidLastWorkday.trim() && !whatIWillDoToday.trim()) {
      return;
    }
    onSave({
      title: title.trim() || getDefaultTitle(date),
      date,
      whatIdidLastWorkday,
      whatIWillDoToday,
      blockers: blockers.trim() || "None",
      notes: notes.trim(),
    });

    if (!isEditing) {
      // Reset form fields
      const today = getTodayFormatted();
      setDate(today);
      setTitle(getDefaultTitle(today));
      setWhatIdidLastWorkday("");
      setWhatIWillDoToday("");
      setBlockers("None");
      setNotes("");
    }
  };

  return (
    <Card className="border-border/60 bg-card/70 shadow-sm backdrop-blur-sm">
      <CardHeader className="border-border/40 border-b pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                {isEditing ? "Edit Workday Log" : "New EDEN Standup Entry"}
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                Main templated inputs for daily EDEN progress and blockers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApplyTemplate}
              className="h-7 text-xs"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Template
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          {/* Top row: Date & Title */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="entry-date" className="text-xs font-medium">
                Log Date
              </Label>
              <Input
                id="entry-date"
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="entry-title" className="text-xs font-medium">
                Entry Title
              </Label>
              <Input
                id="entry-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. TASKS 9-26-26"
                className="h-8 text-xs"
                required
              />
            </div>
          </div>

          {/* Input 1: What I have done last workday */}
          <div className="space-y-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="what-i-did"
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                What I have done last workday
              </Label>
              <span className="text-muted-foreground text-[10px]">Templated Input #1</span>
            </div>
            <Textarea
              id="what-i-did"
              rows={3}
              value={whatIdidLastWorkday}
              onChange={(e) => setWhatIdidLastWorkday(e.target.value)}
              placeholder="List completed tasks, QA validations, merged features, deployed fixes..."
              className="bg-background/80 resize-y text-xs leading-relaxed"
              required
            />
          </div>

          {/* Input 2: What I will do today */}
          <div className="space-y-1.5 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="what-i-will-do"
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300"
              >
                <ListTodo className="h-3.5 w-3.5" />
                What I will do today
              </Label>
              <span className="text-muted-foreground text-[10px]">Templated Input #2</span>
            </div>
            <Textarea
              id="what-i-will-do"
              rows={3}
              value={whatIWillDoToday}
              onChange={(e) => setWhatIWillDoToday(e.target.value)}
              placeholder="List planned goals, active builds, meetings, PRDs, presentations..."
              className="bg-background/80 resize-y text-xs leading-relaxed"
              required
            />
          </div>

          {/* Input 3: Blockers */}
          <div className="space-y-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="blockers"
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Blockers / Urgent Concerns / Other Concerns
              </Label>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-5 px-1.5 text-[10px]"
                  onClick={() => setBlockers("None")}
                >
                  Set &quot;None&quot;
                </Button>
                <span className="text-muted-foreground text-[10px]">Templated Input #3</span>
              </div>
            </div>
            <Textarea
              id="blockers"
              rows={2}
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="None, or technical hurdles, token/API access, dependencies..."
              className="bg-background/80 resize-y text-xs leading-relaxed"
            />
          </div>

          {/* Optional notes section */}
          <div>
            {!showNotes ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-6 text-xs"
                onClick={() => setShowNotes(true)}
              >
                <PlusCircle className="mr-1 h-3 w-3" />
                Add Scratchpad / Extra Notes / Links
              </Button>
            ) : (
              <div className="border-border/50 bg-muted/20 space-y-1 rounded-lg border p-2.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="notes"
                    className="text-muted-foreground flex items-center gap-1 text-xs"
                  >
                    <FileText className="h-3 w-3" />
                    Additional Notes / Links / Context
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground h-5 px-1 text-[10px]"
                    onClick={() => {
                      if (!notes) setShowNotes(false);
                    }}
                  >
                    Hide
                  </Button>
                </div>
                <Textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Extra context, reference links, PRD documents, or reminders..."
                  className="bg-background/80 resize-y text-xs leading-relaxed"
                />
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-border/40 bg-muted/10 flex items-center justify-between border-t py-2.5">
          <div className="text-muted-foreground text-[11px]">
            {isEditing ? "Modifying existing entry" : "Press Save to log into EDEN Notebook"}
          </div>
          <div className="flex items-center gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              className="h-8 gap-1.5 bg-emerald-600 px-4 text-xs font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {isEditing ? (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save Changes
                </>
              ) : (
                <>
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add to Notebook
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
