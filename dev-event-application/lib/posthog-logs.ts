import { SeverityNumber } from "@opentelemetry/api-logs";
import { after } from "next/server";
import { loggerProvider } from "@/instrumentation";

const logger = loggerProvider?.getLogger("posthog-dev-event-application");

export function logApplicationShellRendered() {
  logger?.emit({
    body: "Application shell rendered",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      render_target: "root_layout",
    },
  });
}

export function logEventCatalogueRendered(eventCount: number) {
  logger?.emit({
    body: "Featured event catalogue rendered",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      event_count: eventCount,
      render_target: "home_page",
    },
  });
}

export function flushPostHogLogs() {
  if (loggerProvider) {
    after(async () => {
      await loggerProvider.forceFlush();
    });
  }
}
