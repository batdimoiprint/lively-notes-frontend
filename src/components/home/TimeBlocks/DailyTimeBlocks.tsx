import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DAILY_TIME_BLOCKS,
  formatBlockRange,
  formatCountdown,
  getNextBlockTransition,
} from "@/lib/dailyTimeBlocks";
import { cn } from "@/lib/utils";

export function DailyTimeBlocksContent() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const { activeBlock, nextTransitionAt } = useMemo(() => getNextBlockTransition(now), [now]);
  const millisecondsUntilTransition = Math.max(0, nextTransitionAt.getTime() - now.getTime());

  return (
    <div className="space-y-3">
      <div className="border-border/70 bg-background/40 rounded-lg border px-3 py-2">
        <p className="text-2xl font-semibold tabular-nums">
          {formatCountdown(millisecondsUntilTransition)}
        </p>
        <p className="text-muted-foreground text-xs">
          At {nextTransitionAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </p>
      </div>

      <div className="space-y-2">
        {DAILY_TIME_BLOCKS.map((block) => {
          const isActive = block.id === activeBlock.id;

          return (
            <div
              key={block.id}
              className={cn(
                "flex items-center justify-between rounded-lg border px-3 py-2 transition-colors",
                isActive ? "border-primary/50 bg-primary/10" : "border-border/70 bg-background/30"
              )}
            >
              <div>
                <p className="text-sm font-medium">{block.label}</p>
              </div>
              <p className="text-muted-foreground text-xs">{formatBlockRange(block)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DailyTimeBlocks() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const { activeBlock } = useMemo(() => getNextBlockTransition(now), [now]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="gap-1">
        <CardTitle>Daily Time Blocks</CardTitle>
        <CardDescription>
          Current block: <span className="text-foreground font-semibold">{activeBlock.label}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <DailyTimeBlocksContent />
      </CardContent>
    </Card>
  );
}
