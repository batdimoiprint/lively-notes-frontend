import { useEffect } from "react";
import { queryClient } from "@/api/queryClient";

interface SyncEventData {
  domain: string;
  action: string;
  id?: string;
  timestamp?: number;
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
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || typeof window.EventSource === "undefined") {
      return;
    }

    let eventSource: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let delay = 1000; // 1s initial delay
    const MAX_DELAY = 30000; // 30s max delay

    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    };

    const LOCAL_API_HOST = "http://localhost:3000";
    const MOBILE_API_HOST = "http://192.168.1.6:3000";
    const baseURL = import.meta.env.PROD ? "" : isMobile() ? MOBILE_API_HOST : LOCAL_API_HOST;

    function connect() {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource(`${baseURL}/api/sync/events`, {
        withCredentials: true,
      });

      eventSource.onopen = () => {
        // Reset backoff delay on successful connection
        delay = 1000;
        // Invalidate main queries on reconnect to sync missed updates
        void queryClient.invalidateQueries();
      };

      const handleSyncEvent = (e: MessageEvent) => {
        try {
          const payload: SyncEventData = JSON.parse(e.data);
          if (!payload || !payload.domain) return;

          const queryKey = DOMAIN_QUERY_KEY_MAP[payload.domain];
          if (queryKey) {
            void queryClient.invalidateQueries({ queryKey });
          } else {
            void queryClient.invalidateQueries();
          }
        } catch (err) {
          console.error("Error parsing sync SSE payload:", err);
        }
      };

      eventSource.addEventListener("sync", handleSyncEvent as EventListener);

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }

        // Schedule reconnection with exponential backoff
        reconnectTimeout = setTimeout(() => {
          delay = Math.min(delay * 2, MAX_DELAY);
          connect();
        }, delay);
      };
    }

    connect();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [enabled]);
}
