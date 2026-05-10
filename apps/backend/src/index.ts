import "dotenv/config";
import { logger } from "./lib/logger";

// Prevent the process from exiting on unhandled errors
process.on("unhandledRejection", (reason, promise) => {
  logger.error({ reason, promise }, "Unhandled Rejection at Promise");
});

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught Exception thrown");
});
import app from "./app";
import { initCronJobs } from "./lib/cron";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the root workspace directory
config({ path: path.resolve(__dirname, "../../../.env") });

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  initCronJobs();
});
