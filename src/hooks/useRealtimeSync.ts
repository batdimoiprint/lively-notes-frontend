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

    // Calculate robust API Base URL for SSE
    const getSseBaseUrl = () => {
      const isLocalBackend = window.location.port === "3000";
      if (isLocalBackend) {
        return "http://localhost:3000";
      }
      return "https://1ai6l6vwae.execute-api.ap-southeast-1.amazonaws.com";
    };

    let eventSource: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isCleanedUp = false;

    const connectSse = () => {
      if (isCleanedUp) return;

      if (eventSource) {
        eventSource.close();
      }

      const baseUrl = getSseBaseUrl();
      const sseUrl = `${baseUrl}/api/notes?sync=events`;

      try {
        eventSource = new EventSource(sseUrl, { withCredentials: true });

        eventSource.onopen = () => {
          // Sync any updates missed during reconnect
          triggerRefetch();
        };

        const handleSyncMessage = (e: MessageEvent) => {
          try {
            const payload: SyncEventData = JSON.parse(e.data);
            if (!payload || !payload.domain) return;

            if (payload.timestamp) {
              lastProcessedTimeRef.current = Math.max(
                lastProcessedTimeRef.current,
                payload.timestamp
              );
            }
            triggerRefetch(payload.domain);
          } catch (err) {
            console.error("Failed to parse SSE sync payload:", err);
          }
        };

        eventSource.addEventListener("sync", handleSyncMessage as EventListener);

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }

          // Auto reconnect after 1s (handles AWS API Gateway 29s timeout)
          if (!isCleanedUp) {
            reconnectTimer = setTimeout(connectSse, 1000);
          }
        };
      } catch (err) {
        console.error("SSE connection error:", err);
        if (!isCleanedUp) {
          reconnectTimer = setTimeout(connectSse, 2000);
        }
      }
    };

    connectSse();

    // ── Bulletproof Fallback Polling (Wallpaper Engine & Background Webview) ──
    const pollInterval = setInterval(async () => {
      try {
        const res = await api.get<SyncStatusResponse>("/api/notes?sync=status", {
          headers: { "X-Sync": "status" }
        });
        if (res.data && res.data.lastEventTimestamp > lastProcessedTimeRef.current) {
          lastProcessedTimeRef.current = res.data.lastEventTimestamp;
          triggerRefetch(res.data.lastEvent?.domain);
        }
      } catch (err) {
        // Silent poll error fallback
      }
    }, 3000);

    return () => {
      isCleanedUp = true;
      clearInterval(pollInterval);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (eventSource) eventSource.close();
    };
  }, [enabled]);
}
