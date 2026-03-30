import { useEffect } from "react";
import { queryClient } from "@/api/queryClient";


export function useIgPostRefreshStream() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.EventSource === "undefined") {
      return;
    }

    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const LOCAL_API_HOST = "http://localhost:3000";
    const MOBILE_API_HOST = "http://192.168.1.6:3000";

    const baseURL = import.meta.env.PROD
      ? ""
      : isMobile()
        ? MOBILE_API_HOST
        : LOCAL_API_HOST;

    const source = new EventSource(`${baseURL}/api/igpost/events`, {
      withCredentials: true,
    });

    const handleRefresh = () => {
      void queryClient.invalidateQueries({ queryKey: ["igIdolPosts"] });
    };

    source.addEventListener("open", handleRefresh);
    source.addEventListener("ig-posts-updated", handleRefresh as EventListener);

    return () => {
      source.removeEventListener("ig-posts-updated", handleRefresh as EventListener);
      source.close();
    };
  }, []);
}