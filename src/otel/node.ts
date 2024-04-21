import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import {
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_SERVICE_NAME,
} from "@opentelemetry/semantic-conventions";
import { PrismaInstrumentation } from "@prisma/instrumentation";

const resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: "app-template",
  [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
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

const sdk = new NodeSDK({
  resource,
  traceExporter,
  spanProcessor,
  instrumentations,
});

sdk.start();
