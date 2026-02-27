import type { Request, Response, NextFunction } from "express";
import { log } from "./requestLogger";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(404, id ? `${resource} with id '${id}' not found` : `${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    details?: Array<{ field: string; message: string }>
  ) {
    super(400, message, details);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfterSeconds: number) {
    super(429, `Rate limit exceeded. Retry after ${retryAfterSeconds} seconds.`);
    this.name = "RateLimitError";
  }
}

function formatZodError(error: ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export function errorHandler() {
  return (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        error: err.message,
        details: err.details,
      });
    }

    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: formatZodError(err),
      });
    }

    log(`Unhandled error: ${err.message}\n${err.stack}`, "error-handler", "error");

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  };
}
