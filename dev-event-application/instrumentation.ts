import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function missingConfigurationError(variableName: string) {
  return new Error(
    `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
  );
}

function createLoggerProvider() {
  if (!projectToken || !posthogHost) {
    if (process.env.NODE_ENV === "development") {
      throw missingConfigurationError(
        !projectToken
          ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
          : "NEXT_PUBLIC_POSTHOG_HOST"
      );
    }

    return null;
  }

  return new LoggerProvider({
    resource: resourceFromAttributes({
      "service.name": "dev-event-application",
    }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: new URL("/i/v1/logs", posthogHost).toString(),
          headers: {
            Authorization: `Bearer ${projectToken}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    ],
  });
}

export const loggerProvider = createLoggerProvider();
