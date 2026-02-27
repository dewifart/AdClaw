import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  BUYBACK_WALLET: z.string().min(32).max(44).default("AdCLaw1111111111111111111111111111111111111"),
  SSE_HEARTBEAT_INTERVAL_MS: z.coerce.number().int().positive().default(30_000),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

type EnvConfig = z.infer<typeof envSchema>;

let _config: EnvConfig | null = null;

export function loadConfig(): EnvConfig {
  if (_config) return _config;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    console.error(`[config] Environment validation failed:\n${missing}`);

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }

  _config = result.success
    ? result.data
    : {
        DATABASE_URL: process.env.DATABASE_URL || "",
        PORT: parseInt(process.env.PORT || "5000", 10),
        NODE_ENV: "development" as const,
        RATE_LIMIT_WINDOW_MS: 60_000,
        RATE_LIMIT_MAX_REQUESTS: 100,
        BUYBACK_WALLET: "AdCLaw1111111111111111111111111111111111111",
        SSE_HEARTBEAT_INTERVAL_MS: 30_000,
        LOG_LEVEL: "info" as const,
      };

  return _config;
}

export function getConfig(): EnvConfig {
  if (!_config) return loadConfig();
  return _config;
}
