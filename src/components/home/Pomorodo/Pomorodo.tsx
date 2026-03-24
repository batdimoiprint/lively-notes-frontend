import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";

import {
  deletePomodoroSound,
  uploadPomodoroSound,
  usePomodoroSound,
} from "@/api/sound";

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
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [breakKind, setBreakKind] = useState<BreakKind>("short");
  const [isRunning, setIsRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState<number>(WORK_MS);
  const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0);
  const [soundUrl, setSoundUrl] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endAtRef = useRef<number | null>(null);
  const modeRef = useRef<PomodoroMode>(mode);
  const breakKindRef = useRef<BreakKind>(breakKind);
  const workSessionsCompletedRef = useRef(workSessionsCompleted);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const soundQuery = usePomodoroSound();

  const uploadMutation = useMutation({
    mutationFn: uploadPomodoroSound,
    onSuccess: () => {
      toast.success("Pomodoro sound uploaded");
      void queryClient.invalidateQueries({ queryKey: ["pomodoroSound"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to upload sound");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePomodoroSound,
    onSuccess: () => {
      toast.success("Pomodoro sound deleted");
      void queryClient.invalidateQueries({ queryKey: ["pomodoroSound"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete sound");
    },
  });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    breakKindRef.current = breakKind;
  }, [breakKind]);

  useEffect(() => {
    workSessionsCompletedRef.current = workSessionsCompleted;
  }, [workSessionsCompleted]);

  useEffect(() => {
    const soundBlob = soundQuery.data;

    if (!soundBlob) {
      setSoundUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(soundBlob);
    setSoundUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [soundQuery.data]);

  useEffect(() => {
    if (!soundUrl) {
      audioRef.current = null;
      return;
    }

    const audio = new Audio(soundUrl);
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, [soundUrl]);

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
  };

  const handleSoundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleSoundDelete = () => {
    deleteMutation.mutate();
  };

  useEffect(() => {
    if (!isRunning) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const endAt = endAtRef.current;
      if (!endAt) return;

      const msLeft = Math.max(0, endAt - Date.now());
      setRemainingMs(msLeft);

      if (msLeft === 0) {
        playAlert();

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

  const modeLabel = mode === "work" ? "Focus" : breakKind === "long" ? "Long break" : "Short break";
  const hasSound = Boolean(soundQuery.data);

  // SVG dimensions
  const size = 300;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  // Calculate offset so that it drains as time goes down
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <Card className="flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG Circular Progress */}
        <svg
          className="absolute inset-0 transform -rotate-90 drop-shadow-md"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            className="text-muted stroke-current"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={center}
            cy={center}
          />
          {/* Progress circle */}
          <circle
            className="text-primary stroke-current transition-all duration-300 ease-linear"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={center}
            cy={center}
          />
        </svg>

        {/* Inner Content */}
        <div className="flex flex-col items-center justify-center z-10 text-center space-y-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              {modeLabel}
            </p>
            <p className="text-5xl font-bold tabular-nums tracking-tight" aria-live="polite">
              {formatTime(remainingMs)}
            </p>
            <p className="text-muted-foreground text-xs font-medium">
              Session {Math.min(4, workSessionsCompleted + (mode === "work" ? 1 : 0))} / 4
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.aac"
              className="hidden"
              onChange={handleSoundUpload}
              disabled={uploadMutation.isPending || deleteMutation.isPending}
            />
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-7 rounded-full px-2 text-[10px] font-semibold"
                disabled={uploadMutation.isPending || deleteMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadMutation.isPending ? (
                  <Spinner className="size-3" />
                ) : (
                  <Upload className="size-3" />
                )}
                Upload sound
              </Button>
              {hasSound ? (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="h-7 w-7 rounded-full"
                  disabled={uploadMutation.isPending || deleteMutation.isPending}
                  onClick={handleSoundDelete}
                >
                  {deleteMutation.isPending ? <Spinner className="size-3" /> : <Trash2 className="size-3" />}
                </Button>
              ) : null}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Sound: {hasSound ? "active" : "none"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isRunning ? (
              <Button onClick={start} size="sm" className="w-20 rounded-full shadow-sm">
                Start
              </Button>
            ) : (
              <Button onClick={pause} variant="secondary" size="sm" className="w-20 rounded-full shadow-sm">
                Pause
              </Button>
            )}
            <Button onClick={reset} variant="ghost" size="sm" className="w-20 rounded-full">
              Reset
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
