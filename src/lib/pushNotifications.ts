import api from "@/api/axiosInstance";

const VAPID_PUBLIC_KEY = "BOTDduYjp3ldQdjF1MtnqkBTogp_tm1hIwyPOgV2_VUIoSJ-Czk3CQi0jjev6O1m6vjfooHyO4Z391nA2IiqcDA";

let swRegistration: ServiceWorkerRegistration | null = null;

/**
 * Register the service worker and set up push notifications.
 * Call this once on app startup.
 */
export async function initPushNotifications(): Promise<void> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications are not supported in this browser");
    return;
  }

  try {
    swRegistration = await navigator.serviceWorker.register("/sw.js");
    console.log("Service worker registered");

    // Auto-prompt user for notification permissions on load if not set yet
    if (Notification.permission === "default") {
      console.log("Automatically prompting for notification permission...");
      await subscribeToPush();
    }
  } catch (error) {
    console.error("Service worker registration failed:", error);
  }
}

/**
 * Request notification permission and subscribe to push.
 * Returns true if successfully subscribed.
 */
export async function subscribeToPush(): Promise<boolean> {
  if (!swRegistration) {
    await initPushNotifications();
  }

  if (!swRegistration) {
    console.error("No service worker registration available");
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("Notification permission denied");
    return false;
  }

  try {
    // Convert hardcoded VAPID key to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    // Subscribe to push
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
    });

    // Send subscription to backend
    try {
      await api.post("/api/push/subscribe", subscription.toJSON());
      console.log("Push subscription saved on backend");
    } catch (apiErr) {
      console.warn("Could not save subscription on backend (possibly unauthenticated yet):", apiErr);
    }
    return true;
  } catch (error) {
    console.error("Failed to subscribe to push:", error);
    return false;
  }
}

/**
 * Check if the user is currently subscribed to push notifications.
 */
export async function isSubscribedToPush(): Promise<boolean> {
  if (!swRegistration) return false;

  const subscription = await swRegistration.pushManager.getSubscription();
  return subscription !== null;
}

/**
 * Send a test push notification via the backend.
 */
export async function sendTestNotification(): Promise<string> {
  const { data } = await api.post<{ message: string }>("/api/push/test");
  return data.message;
}

// ── Helper ──────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
