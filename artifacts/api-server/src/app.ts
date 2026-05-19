import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import router from "./routes";
import { logger } from "./lib/logger";
import { connectMongo } from "./lib/mongoose";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage & Record<string, unknown>) {
        return {
          id: req["id"] as string,
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

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found", message: "The requested route does not exist." });
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof Error && "status" in err ? (err as Record<string, unknown>)["status"] as number : 500;
  const message = err instanceof Error ? err.message : "An unexpected error occurred.";

  logger.error(
    { err, method: req.method, url: req.url, status },
    "Unhandled request error",
  );

  res.status(status ?? 500).json({
    error: status === 500 ? "Internal Server Error" : "Error",
    message: process.env["NODE_ENV"] === "production" ? "An unexpected error occurred." : message,
  });
});

connectMongo().catch((err) => logger.error({ err }, "MongoDB connection error"));

export default app;
