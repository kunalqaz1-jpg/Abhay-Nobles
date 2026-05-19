import express, { type Express } from "express";
import cors from "cors";
import pinoHttpImport from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import router from "./routes";
import { logger } from "./lib/logger";
import { connectMongo } from "./lib/mongoose";

// pino-http ships as a CJS module; the default export resolves differently
// depending on the TypeScript moduleResolution setting used by the build tool.
// This pattern works under both "bundler" (Vite/esbuild) and "node"/"node16" (tsc/Vercel).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pinoHttp: (opts: Record<string, unknown>) => express.RequestHandler = (pinoHttpImport as any).default ?? pinoHttpImport;

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage & Record<string, unknown>) {
        return {
          id: req["id"],
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

connectMongo().catch((err) => logger.error({ err }, "MongoDB connection error"));

export default app;
