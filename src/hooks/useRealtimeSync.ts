import { useEffect, useRef } from "react";
import { queryClient } from "@/api/queryClient";
import api from "@/api/axiosInstance";

interface SyncEventData {
  domain: string;
  action: string;
  id?: string;
  timestamp?: number;
}

interface SyncStatusResponse {
  lastEventTimestamp: number;
  lastEvent: SyncEventData | null;
}

const DOMAIN_QUERY_KEY_MAP: Record<string, string[]> = {
  notes: ["notes"],
  todos: ["todos"],
  sections: ["sections"],
  calendarNotes: ["calendarNotes"],
  igPosts: ["igIdolPosts"],
  settings: ["settings"],
  sound: ["pomodoroSound"],
};

/**
 * Realtime sync via MongoDB-backed polling.
 *
 * SSE is intentionally NOT used because AWS API Gateway HTTP API
 * hard-kills connections after 29 seconds, and each Lambda invocation
 * has its own in-memory connection Map — SSE broadcasts can never
 * reach other clients.
 *
 * Polling /api/notes?sync=status every 1.5s is the reliable path.
 * The endpoint reads sync state from MongoDB (persisted by every
 * mutation's broadcastSyncEvent call).
 */
export function useRealtimeSync(enabled: boolean = true) {
  const lastProcessedTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    // Force active query refetch for domain
    const triggerRefetch = (domain?: string) => {
      const queryKey = domain ? DOMAIN_QUERY_KEY_MAP[domain] : undefined;
      if (queryKey) {
        void queryClient.refetchQueries({ queryKey, type: "all" });
        void queryClient.invalidateQueries({ queryKey, refetchType: "all" });
      } else {
        void queryClient.refetchQueries({ type: "all" });
        void queryClient.invalidateQueries({ refetchType: "all" });
      }
    };

    // ── Polling-based realtime sync ──────────────────────────────
    const pollInterval = setInterval(async () => {
      try {
        const res = await api.get<SyncStatusResponse>("/api/notes?sync=status", {
          headers: { "X-Sync": "status" },
        });
        if (
          res.data &&
          res.data.lastEventTimestamp > lastProcessedTimeRef.current
        ) {
          lastProcessedTimeRef.current = res.data.lastEventTimestamp;
          triggerRefetch(res.data.lastEvent?.domain);
        }
      } catch {
        // Silent poll error — network blip, cold start, etc.
      }
    }, 1500);

    // Do an immediate poll on mount to catch any missed updates
    (async () => {
      try {
        const res = await api.get<SyncStatusResponse>("/api/notes?sync=status", {
          headers: { "X-Sync": "status" },
        });
        if (
          res.data &&
          res.data.lastEventTimestamp > lastProcessedTimeRef.current
        ) {
          lastProcessedTimeRef.current = res.data.lastEventTimestamp;
          triggerRefetch(res.data.lastEvent?.domain);
        }
      } catch {
        // Silent
      }
    })();

    return () => {
      clearInterval(pollInterval);
    };
  }, [enabled]);
}
