import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { PrismaInstrumentation } from "@prisma/instrumentation";

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: "web-app-template",
  "deployment.environment": process.env.NODE_ENV,
});

const url = process.env.TRACE_EXPORTER_URL || /* for local */ undefined;

const traceExporter = new OTLPTraceExporter({
  url,
});

const spanProcessor = new BatchSpanProcessor(traceExporter);

const instrumentations = [
  new HttpInstrumentation(),
  new PrismaInstrumentation(),
];

const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter(),
});

const sdk = new NodeSDK({
  resource,
  traceExporter,
  spanProcessor,
  instrumentations,
  metricReader,
});

sdk.start();
