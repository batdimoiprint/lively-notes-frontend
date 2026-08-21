/**
 * Realtime sync (DISABLED)
 *
 * Polling /api/notes?sync=status is disabled to prevent continuous AWS API Gateway / Lambda charges.
 */
export function useRealtimeSync(_enabled: boolean = false) {
  // No-op: polling disabled
}
