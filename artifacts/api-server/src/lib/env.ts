import { logger } from "./logger";

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

const ENV_VARS: EnvVar[] = [
  {
    name: "PORT",
    required: true,
    description: "Port the HTTP server binds to",
  },
  {
    name: "MONGODB_URI",
    required: false,
    description: "MongoDB connection string — data routes return 503 without this",
  },
  {
    name: "NODE_ENV",
    required: false,
    description: "Runtime environment (development | production)",
  },
  {
    name: "LOG_LEVEL",
    required: false,
    description: "Pino log level (trace | debug | info | warn | error)",
  },
];

export function validateEnv(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const v of ENV_VARS) {
    const value = process.env[v.name];
    if (!value) {
      if (v.required) {
        missing.push(v.name);
      } else {
        warnings.push(v.name);
      }
    }
  }

  if (missing.length > 0) {
    logger.error(
      { missing },
      `Server cannot start — required environment variable(s) not set: ${missing.join(", ")}`,
    );
    process.exit(1);
  }

  if (warnings.length > 0) {
    for (const name of warnings) {
      const v = ENV_VARS.find((e) => e.name === name)!;
      logger.warn(`${name} is not set — ${v.description}`);
    }
  }

  logger.info(
    {
      env: ENV_VARS.reduce<Record<string, string>>((acc, v) => {
        const value = process.env[v.name];
        acc[v.name] = value ? (v.name.includes("URI") || v.name.includes("SECRET") || v.name.includes("KEY") ? "[redacted]" : value) : "(not set)";
        return acc;
      }, {}),
    },
    "Environment validated",
  );
}
