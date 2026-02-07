import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useRef, useState } from "react";
import alertSoundUrl from "@/assets/33_max_verstapoen.mp3";

// VIBECODED PART
// JUST EXPERIMENTING STUFFS
// TODO: DO THIS ON MY OWN SHI

type PomodoroMode = "work" | "break";
type BreakKind = "short" | "long";

const WORK_MS = 25 * 60 * 1000;
const SHORT_BREAK_MS = 5 * 60 * 1000;
const LONG_BREAK_MS = 15 * 60 * 1000;

function formatTime(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Pomorodo() {
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [breakKind, setBreakKind] = useState<BreakKind>("short");
  const [isRunning, setIsRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState<number>(WORK_MS);
  const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endAtRef = useRef<number | null>(null);
  const modeRef = useRef<PomodoroMode>(mode);
  const breakKindRef = useRef<BreakKind>(breakKind);
  const workSessionsCompletedRef = useRef(workSessionsCompleted);
  const warnedThirtySecRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    modeRef.current = mode;
    // Reset the "30 seconds left" warning each time we enter a new mode
    // so it can fire once during work and once during break.
    warnedThirtySecRef.current = false;
  }, [mode]);

  useEffect(() => {
    breakKindRef.current = breakKind;
  }, [breakKind]);

  useEffect(() => {
    workSessionsCompletedRef.current = workSessionsCompleted;
  }, [workSessionsCompleted]);

  useEffect(() => {
    // NOTE: Most browsers require a user gesture (click) before audio can play.
    const audio = new Audio(alertSoundUrl);
    audio.preload = "auto";
    audioRef.current = audio;
    return () => {
      audioRef.current = null;
    };
  }, []);

  const playAlert = () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      void audio.play();
    } catch {
      // ignore autoplay/gesture restrictions
    }
  };

  const totalMs = mode === "work" ? WORK_MS : breakKind === "long" ? LONG_BREAK_MS : SHORT_BREAK_MS;
  const progressPercent = useMemo(() => {
    const clamped = Math.min(totalMs, Math.max(0, remainingMs));
    return ((totalMs - clamped) / totalMs) * 100;
  }, [remainingMs, totalMs]);

  const start = () => {
    if (isRunning) return;
    // Best-effort: try to unlock audio on first user interaction.
    if (audioRef.current) {
      try {
        audioRef.current.muted = true;
        void audioRef.current.play().finally(() => {
          if (!audioRef.current) return;
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.muted = false;
        });
      } catch {
        // ignore
      }
    }
    endAtRef.current = Date.now() + remainingMs;
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endAtRef.current = null;
  };

  const reset = () => {
    pause();
    setMode("work");
    setBreakKind("short");
    setRemainingMs(WORK_MS);
    setWorkSessionsCompleted(0);
    warnedThirtySecRef.current = false;
  };

  const steps = useMemo(() => {
    return [
      { label: "Work", key: "work-1" },
      { label: "Break", key: "break-1" },
      { label: "Work", key: "work-2" },
      { label: "Break", key: "break-2" },
      { label: "Work", key: "work-3" },
      { label: "Break", key: "break-3" },
      { label: "Work", key: "work-4" },
      { label: "Long break", key: "break-long" },
    ];
  }, []);

  const currentStepIndex = useMemo(() => {
    // workSessionsCompleted is how many work sessions have been fully completed in the current cycle.
    // Work step indices: 0,2,4,6
    // Break step indices: 1,3,5,7 (7 is long break after 4th work)
    const completed = Math.min(4, Math.max(0, workSessionsCompleted));
    if (mode === "work") return completed * 2;
    // mode === 'break'
    return Math.min(7, Math.max(1, completed * 2 - 1));
  }, [mode, workSessionsCompleted]);

  useEffect(() => {
    if (!isRunning) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const endAt = endAtRef.current;
      if (!endAt) return;

      const msLeft = Math.max(0, endAt - Date.now());
      setRemainingMs(msLeft);

      // Play alert 30s before the end of the current mode (once per mode).
      if (msLeft > 0 && msLeft <= 30_000 && !warnedThirtySecRef.current) {
        warnedThirtySecRef.current = true;
        playAlert();
      }

      if (msLeft === 0) {
        const wasMode = modeRef.current;

        if (wasMode === "work") {
          const nextWorkCompleted = Math.min(4, workSessionsCompletedRef.current + 1);
          const nextBreakKind: BreakKind = nextWorkCompleted >= 4 ? "long" : "short";
          const nextDuration = nextBreakKind === "long" ? LONG_BREAK_MS : SHORT_BREAK_MS;

          workSessionsCompletedRef.current = nextWorkCompleted;
          setWorkSessionsCompleted(nextWorkCompleted);

          breakKindRef.current = nextBreakKind;
          setBreakKind(nextBreakKind);

          modeRef.current = "break";
          setMode("break");
          setRemainingMs(nextDuration);
          endAtRef.current = Date.now() + nextDuration;
          return;
        }

        // wasMode === 'break'
        const finishedBreakKind = breakKindRef.current;
        if (finishedBreakKind === "long") {
          workSessionsCompletedRef.current = 0;
          setWorkSessionsCompleted(0);
          breakKindRef.current = "short";
          setBreakKind("short");
        }

        modeRef.current = "work";
        setMode("work");
        setRemainingMs(WORK_MS);
        endAtRef.current = Date.now() + WORK_MS;
      }
    }, 250);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const modeLabel = mode === "work" ? "Focus" : breakKind === "long" ? "Long break" : "Break";
  const modeHint =
    mode === "work" ? "Work session" : breakKind === "long" ? "15 min break" : "Short break";

  return (
    <Card className="w-full p-4">
      {/* TEST BUTTONS FOR ALERT SOUND */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              void audioRef.current.play();
            }
          }}
        >
          Play Alert Sound
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          }}
        >
          Pause Alert Sound
        </Button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{modeHint}</p>
          <p className="text-lg font-semibold">{modeLabel}</p>
          <p className="text-muted-foreground text-xs">
            Session {Math.min(4, workSessionsCompleted + 1)} / 4
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums" aria-live="polite">
            {formatTime(remainingMs)}
          </p>
          <p className="text-muted-foreground text-xs">{Math.round(progressPercent)}%</p>
        </div>
      </div>

      <div className="bg-muted h-2 w-full overflow-hidden rounded">
        <div
          className="bg-primary h-full"
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;

          const className = isCurrent
            ? "rounded px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground"
            : isCompleted
              ? "rounded px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground"
              : "rounded px-2 py-1 text-xs font-medium bg-muted text-muted-foreground";

          return (
            <span
              key={step.key}
              className={className}
              aria-current={isCurrent ? "step" : undefined}
            >
              {step.label}
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {!isRunning ? (
          <Button onClick={start} className="w-24">
            Start
          </Button>
        ) : (
          <Button onClick={pause} variant="secondary" className="w-24">
            Pause
          </Button>
        )}
        <Button onClick={reset} variant="ghost">
          Reset
        </Button>
      </div>
    </Card>
  );
}
