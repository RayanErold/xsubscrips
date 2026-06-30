import pino from "pino";
import { observaLogStream } from "../middleware/observa";

const logLevel = process.env.LOG_LEVEL ?? "info";

export const logger = pino(
  {
    level: logLevel,
    redact: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
    ],
  },
  pino.multistream([
    { stream: process.stdout, level: logLevel as pino.Level },
    { stream: observaLogStream, level: logLevel as pino.Level },
  ])
);

