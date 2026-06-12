export const logger = {
  error: (message: string, context?: Record<string, unknown>) => {
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${message}`, context);
    } else {
      // In production, send logs to an external service (e.g. Sentry, Datadog)
      // Example: Sentry.captureException(context?.error || new Error(message), { extra: context });
    }
  },
  info: (message: string, context?: Record<string, unknown>) => {
    if (import.meta.env.DEV) {
      console.log(`[Info] ${message}`, context);
    } else {
      // In production, log info or breadcrumbs
    }
  },
};
