import { Request, Response, NextFunction } from "express";
import { Log } from "../../../logging-middleware/src/index";

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  Log("backend", "info", "middleware",
    `→ ${req.method} ${req.path} - Query: ${JSON.stringify(req.query)}`
  );

  res.on("finish", () => {
    const ms = Date.now() - start;
    const level = res.statusCode >= 500 ? "error"
      : res.statusCode >= 400 ? "warn" : "info";
    Log("backend", level, "middleware",
      `← ${req.method} ${req.path} ${res.statusCode} - ${ms}ms`
    );
  });

  next();
}