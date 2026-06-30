import type { Request, Response, NextFunction } from "express";
import { Writable } from "stream";

const OBSERVA_API_KEY = process.env.OBSERVA_API_KEY;
const OBSERVA_APP_ID_RAW = (process.env.OBSERVA_APP_ID || "").replace("preview-sandbox--", "");
const SERVICE_NAME = process.env.SERVICE_NAME || "xsubscrips-backend";
const OBSERVA_ENDPOINT = `https://api.base44.app/api/apps/${OBSERVA_APP_ID_RAW}/entities`;

/**
 * Asynchronously sends telemetry payload to a specific Base44 entity endpoint.
 */
function _send(path: string, body: any) {
  if (!OBSERVA_API_KEY || !OBSERVA_APP_ID_RAW) {
    return;
  }

  const url = `${OBSERVA_ENDPOINT}${path}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OBSERVA_API_KEY}`,
    },
    body: JSON.stringify(body),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorBody = await res.text();
        console.warn(`[Observa API Alert] Failed to post to ${path}: Status ${res.status} - ${errorBody}`);
      }
    })
    .catch((err) => {
      console.error(`[Observa Network Error] Failed to connect to ${path}:`, err.message);
    });
}

/**
 * Registers this microservice inside the Observa Service entity.
 */
export function registerObservaService() {
  const servicePayload = {
    name: SERVICE_NAME,
    display_name: "Xsubscrips Backend",
  };
  _send("/Service", servicePayload);
}

/**
 * Express middleware to capture latency and HTTP status code metrics.
 */
export function observaMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(startTime);
    const latencyMs = Math.round(diff[0] * 1e3 + diff[1] * 1e-6);
    const path = req.baseUrl + req.path;

    // 1. Log request latency as a Metric
    const metricPayload = {
      service: SERVICE_NAME,
      metric_type: `latency_${req.method.toLowerCase()}`,
      value: latencyMs,
    };
    _send("/Metric", metricPayload);

    // 2. Auto-capture HTTP errors (status code >= 400) as Alerts
    if (res.statusCode >= 400) {
      const alertPayload = {
        severity: res.statusCode >= 500 ? "HIGH" : "MEDIUM",
        service: SERVICE_NAME,
        name: `HTTP_${res.statusCode}`,
        message: `HTTP request to ${req.method} ${path || "/"} failed with status ${res.statusCode}`,
        alert_type: "http_error",
      };
      _send("/Alert", alertPayload);
    }
  });

  next();
}

/**
 * Express error-handling middleware to capture unhandled route exceptions.
 */
export function observaErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const alertPayload = {
    severity: "HIGH",
    service: SERVICE_NAME,
    name: err.name || "UnhandledException",
    message: err.message || String(err),
    alert_type: "exception",
  };

  _send("/Alert", alertPayload);

  next(err);
}

/**
 * Writable stream to forward parsed Pino logs to LogEntry entity.
 */
const levelMap: Record<number, string> = {
  10: "TRACE",
  20: "DEBUG",
  30: "INFO",
  40: "WARN",
  50: "ERROR",
  60: "FATAL",
};

export const observaLogStream = new Writable({
  write(chunk, encoding, callback) {
    try {
      const log = JSON.parse(chunk.toString());
      
      const levelNum = Number(log.level);
      const severity = levelMap[levelNum] || "INFO";
      
      _send("/LogEntry", {
        severity,
        service: SERVICE_NAME,
        message: log.msg || "",
      });
    } catch (e) {
      // Ignore parsing errors to prevent crashes
    }
    callback();
  },
});
