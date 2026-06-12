import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";

import PomodoroTimer from "./PomodoroTimer";
import { DailyTimeBlocksContent } from "@/components/home/TimeBlocks/DailyTimeBlocks";

type CardView = "pomodoro" | "time-blocks";

export default function SpecialCard() {
  const [view, setView] = useState<CardView>("pomodoro");
  const isPomodoroView = view === "pomodoro";

  return (
    <Card className="bg-background/80 flex flex-1 flex-col backdrop-blur-md">
      <CardHeader>
        <Button
          type="button"
          size="sm"
          variant={isPomodoroView ? "default" : "ghost"}
          className="h-6 rounded-full px-2 text-[10px] font-medium shadow-none"
          onClick={() => setView("pomodoro")}
        >
          Pomodoro
        </Button>
        <Button
          type="button"
          size="sm"
          variant={isPomodoroView ? "ghost" : "default"}
          className="h-6 rounded-full px-2 text-[10px] font-medium shadow-none"
          onClick={() => setView("time-blocks")}
        >
          Time blocks
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pb-4">
        {/* Pomodoro View */}
        <div
          className={isPomodoroView ? "flex flex-1 flex-col" : "hidden"}
          aria-hidden={!isPomodoroView}
        >
          <PomodoroTimer />
        </div>

        {/* Time Blocks View */}
        <div className={isPomodoroView ? "hidden" : "block"} aria-hidden={isPomodoroView}>
          <DailyTimeBlocksContent />
        </div>
      </CardContent>
    </Card>
  );
}
