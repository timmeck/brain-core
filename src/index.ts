// ── Types ──────────────────────────────────────────────────
export type { IpcMessage } from './types/ipc.types.js';

// ── Utils ──────────────────────────────────────────────────
export { sha256 } from './utils/hash.js';
export { createLogger, getLogger, resetLogger } from './utils/logger.js';
export type { LoggerOptions } from './utils/logger.js';
export { normalizePath, getDataDir, getPipeName } from './utils/paths.js';
export { TypedEventBus } from './utils/events.js';

// ── DB ─────────────────────────────────────────────────────
export { createConnection } from './db/connection.js';

// ── IPC ────────────────────────────────────────────────────
export { encodeMessage, MessageDecoder } from './ipc/protocol.js';
export { IpcServer } from './ipc/server.js';
export type { IpcRouter } from './ipc/server.js';
export { IpcClient } from './ipc/client.js';

// ── MCP ────────────────────────────────────────────────────
export { startMcpServer } from './mcp/server.js';
export type { McpServerOptions } from './mcp/server.js';
export { McpHttpServer } from './mcp/http-server.js';
export type { McpHttpServerOptions } from './mcp/http-server.js';

// ── CLI ────────────────────────────────────────────────────
export { c, baseIcons, header, keyValue, statusBadge, progressBar, divider, table, stripAnsi } from './cli/colors.js';

// ── API ────────────────────────────────────────────────────
export { BaseApiServer } from './api/server.js';
export type { ApiServerOptions, RouteDefinition } from './api/server.js';

// ── Cross-Brain ────────────────────────────────────────────
export { CrossBrainClient } from './cross-brain/client.js';
export type { BrainPeer } from './cross-brain/client.js';
