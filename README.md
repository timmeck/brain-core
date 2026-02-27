# Brain Core

[![npm version](https://img.shields.io/npm/v/@timmeck/brain-core)](https://www.npmjs.com/package/@timmeck/brain-core)
[![npm downloads](https://img.shields.io/npm/dm/@timmeck/brain-core)](https://www.npmjs.com/package/@timmeck/brain-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/timmeck/brain-core)](https://github.com/timmeck/brain-core)

**Shared infrastructure for the Brain ecosystem — IPC, MCP, CLI, DB, and utilities.**

Brain Core extracts the common infrastructure used across all Brain MCP servers ([Brain](https://github.com/timmeck/brain), [Trading Brain](https://github.com/timmeck/trading-brain), [Marketing Brain](https://github.com/timmeck/marketing-brain)) into a single, reusable package.

## What's Included

| Module | Description |
|--------|-------------|
| **IPC Protocol** | Length-prefixed JSON frames over named pipes (Windows) / Unix sockets |
| **IPC Server** | Named pipe server with auto-recovery of stale pipes |
| **IPC Client** | Client with request/response, timeouts, and notification support |
| **MCP Server** | Stdio transport for Claude Code with auto-daemon-start |
| **MCP HTTP Server** | SSE transport for Cursor, Windsurf, Cline, Continue |
| **REST API Server** | Base HTTP server with CORS, auth, SSE events, batch RPC |
| **DB Connection** | SQLite (better-sqlite3) with WAL mode, foreign keys, caching |
| **CLI Colors** | Shared color palette, formatting helpers (header, table, badges) |
| **Logger** | Winston-based structured logging with file rotation |
| **Event Bus** | Generic typed event emitter |
| **Utils** | Path normalization, data dir resolution, SHA-256 hashing |

## Installation

```bash
npm install @timmeck/brain-core
```

## Usage

### Building a new Brain

```typescript
import {
  createLogger,
  getDataDir,
  getPipeName,
  createConnection,
  IpcServer,
  IpcClient,
  startMcpServer,
  McpHttpServer,
  BaseApiServer,
  TypedEventBus,
  c, header, keyValue,
} from '@timmeck/brain-core';

// 1. Configure for your brain
const dataDir = getDataDir('MY_BRAIN_DATA_DIR', '.my-brain');
createLogger({ envVar: 'MY_BRAIN_LOG_LEVEL', dataDir, defaultFilename: 'my-brain.log' });

// 2. Database
const db = createConnection(`${dataDir}/my-brain.db`);

// 3. Typed events
interface MyBrainEvents {
  'item:created': { itemId: number };
  'item:updated': { itemId: number };
}
const bus = new TypedEventBus<MyBrainEvents>();
bus.on('item:created', ({ itemId }) => console.log(`Item ${itemId} created`));

// 4. IPC Server
const router = new MyRouter(services); // implements IpcRouter interface
const ipcServer = new IpcServer(router, getPipeName('my-brain'), 'my-brain');
ipcServer.start();

// 5. REST API (extend BaseApiServer for custom routes)
class MyApiServer extends BaseApiServer {
  protected buildRoutes() {
    return [
      { method: 'GET', pattern: /^\/api\/v1\/items$/, ipcMethod: 'item.list',
        extractParams: () => ({}) },
    ];
  }
}

// 6. MCP Server (stdio)
await startMcpServer({
  name: 'my-brain',
  version: '1.0.0',
  entryPoint: import.meta.filename,
  registerTools: (server, ipc) => { /* register MCP tools */ },
});

// 7. CLI output
console.log(header('My Brain Status'));
console.log(keyValue('Items', 42));
console.log(c.success('All systems operational'));
```

### IPC Router Interface

Your brain must implement the `IpcRouter` interface:

```typescript
import type { IpcRouter } from '@timmeck/brain-core';

class MyRouter implements IpcRouter {
  handle(method: string, params: unknown): unknown {
    switch (method) {
      case 'item.list': return this.itemService.list();
      case 'item.get': return this.itemService.get(params);
      default: throw new Error(`Unknown method: ${method}`);
    }
  }

  listMethods(): string[] {
    return ['item.list', 'item.get'];
  }
}
```

## Architecture

```
@timmeck/brain-core
├── Types ─── IpcMessage
├── Utils ─── hash, logger, paths, events
├── DB ────── SQLite connection (WAL mode)
├── IPC ───── protocol, server, client
├── MCP ───── stdio server, HTTP/SSE server
├── CLI ───── colors, formatting helpers
└── API ───── BaseApiServer (CORS, auth, RPC, SSE)
```

## Brain Ecosystem

| Brain | Purpose | Ports |
|-------|---------|-------|
| [Brain](https://github.com/timmeck/brain) | Error memory & code intelligence | 7777/7778 |
| [Trading Brain](https://github.com/timmeck/trading-brain) | Adaptive trading intelligence | 7779/7780 |
| [Marketing Brain](https://github.com/timmeck/marketing-brain) | Content strategy & social media | 7781/7782 |

All three brains are standalone — brain-core is an **optional** shared dependency that eliminates code duplication.

## License

[MIT](LICENSE)
