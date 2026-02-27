import type { Request, Response, NextFunction } from "express";
import { getConfig } from "../config";

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  const config = getConfig();
  return LOG_LEVELS[level] >= LOG_LEVELS[config.LOG_LEVEL];
}

function formatTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function log(message: string, source: string = "server", level: LogLevel = "info"): void {
  if (!shouldLog(level)) return;

  const prefix = `${formatTime()} [${source}]`;

  switch (level) {
    case "error":
      console.error(`${prefix} ${message}`);
      break;
    case "warn":
      console.warn(`${prefix} ${message}`);
      break;
    case "debug":
      console.debug(`${prefix} ${message}`);
      break;
    default:
      console.log(`${prefix} ${message}`);
  }
}

export function requestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api")) return next();

    const start = Date.now();

    let capturedBody: Record<string, unknown> | undefined;
    const originalJson = res.json;
    res.json = function (body: any, ...args: any[]) {
      capturedBody = body;
      return originalJson.apply(res, [body, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      const status = res.statusCode;

      let line = `${req.method} ${req.path} ${status} in ${duration}ms`;

      if (capturedBody && shouldLog("debug")) {
        const bodyStr = JSON.stringify(capturedBody);
        line += ` :: ${bodyStr.length > 200 ? bodyStr.slice(0, 200) + "..." : bodyStr}`;
      }

      const level: LogLevel = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
      log(line, "api", level);
    });

    next();
  };
}
