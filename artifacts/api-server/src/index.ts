import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { logger } from "./lib/logger.js";
import { setIo } from "./socket.js";
import { runSeed } from "./seed.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
  path: "/api/socket.io",
});

setIo(io);

io.on("connection", (socket) => {
  logger.info({ socketId: socket.id }, "Socket connected");
  socket.on("disconnect", () => {
    logger.info({ socketId: socket.id }, "Socket disconnected");
  });
});

httpServer.listen(port, async () => {
  logger.info({ port }, "Server listening");
  await runSeed();
});
