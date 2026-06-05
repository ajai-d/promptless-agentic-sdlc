# Plan — Top Stocks MCP Server

> **Seed:** An MCP server that returns the top 5 performing stocks of the day, with a client and a simple UI to display the results.
> **Risk Level:** 2 | **Spec:** [spec/spec.md](../spec/spec.md)

---

## 2a. Architecture

### System Diagram

```
┌─────────────────────────────────────────────────┐
│              MCP Server Process                  │
│                                                 │
│  Transport (stdio|SSE)                          │
│       │                                         │
│       ▼                                         │
│  get_top_stocks Handler                         │
│       │                                         │
│       ▼                                         │
│  StockProvider Interface                        │
│       │                                         │
│       ▼                                         │
│  MockProvider (hardcoded data)                  │
└─────────────────────────────────────────────────┘
        ▲                       │
        │ stdio or SSE          │ Stock[] JSON
        │                       ▼
┌──────────────┐        ┌──────────────┐
│  client.ts   │───────▶│  index.html  │
│  (MCP Client)│        │  (Web UI)    │
└──────────────┘        └──────────────┘
```

### Component Breakdown

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| Server | TypeScript, `@modelcontextprotocol/sdk` | Expose `get_top_stocks` MCP tool, delegate to active provider |
| Transport | `StdioServerTransport` / `SSEServerTransport` | Selected by `TRANSPORT` env var (default: `stdio`) |
| Provider Interface | TypeScript interface | Contract: `getTopStocks(): Promise<Stock[]>` |
| Mock Provider | TypeScript class | Returns 5 hardcoded stocks |
| Client | TypeScript, `@modelcontextprotocol/sdk` | Spawns server, calls tool, outputs JSON |
| Web UI | Single HTML file, vanilla JS | Fetches data from client script, renders table |
| Tests | Vitest | Unit tests for provider, integration test for tool response |

### Key Decisions

- **Monorepo** — single `package.json`, all code in `src/`
- **No framework for UI** — plain HTML + `<script>` tag
- **Vitest** over Jest — faster, native ESM/TypeScript support
- **ESM modules** — `"type": "module"` in package.json
- **Dual transport** — stdio default, SSE opt-in via env var for Azure readiness

---

## 2b. Design

### Data Types

```typescript
interface Stock {
  ticker: string;        // e.g. "AAPL"
  name: string;          // e.g. "Apple Inc."
  price: number;         // current price in USD
  changePercent: number; // daily % change, e.g. 3.45
}
```

### Provider Interface

```typescript
interface StockProvider {
  getTopStocks(): Promise<Stock[]>; // always returns exactly 5
}
```

### MCP Tool Schema

```json
{
  "name": "get_top_stocks",
  "description": "Returns the top 5 performing stocks of the day",
  "inputSchema": { "type": "object", "properties": {} },
  "output": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "ticker": { "type": "string" },
        "name": { "type": "string" },
        "price": { "type": "number" },
        "changePercent": { "type": "number" }
      }
    }
  }
}
```

### File Structure

```
src/
  types.ts            — Stock interface
  provider.ts         — StockProvider interface
  mock-provider.ts    — MockProvider class (hardcoded data)
  server.ts           — MCP server setup + tool registration
  client.ts           — MCP client: spawn server, call tool, output JSON
  ui/index.html       — HTML table rendering
tests/
  provider.test.ts    — Unit: MockProvider returns 5 stocks
  server.test.ts      — Integration: tool call returns valid Stock[]
package.json
tsconfig.json
README.md
```

---

## 2c. Orchestration

### Risk Level: 2 (shared context, fast-path allowed)

### Execution Pattern: Sequential (Interactive)

All agents share a single VS Code Agent Mode context. User invokes each agent in order. Fleet/Delegate patterns deferred to future feature additions.

### Agent Registry

| # | Agent | Definition File | Mode | Autonomous? | Scope |
|---|-------|----------------|------|-------------|-------|
| 1 | Setup Agent | `.github/agents/setup-agent.md` | Autopilot | Yes | Scaffold project, install deps, configure tsconfig/vitest |
| 2 | Implementation Agent | `.github/agents/impl-agent.md` | Interactive | No — approve per file | Write all `src/` files per 2b Design |
| 3 | Test Agent | `.github/agents/test-agent.md` | Autopilot | Yes | Write + run tests; fail = escalate |
| 4 | Integration Agent | `.github/agents/integration-agent.md` | Interactive | No — final review | Wire end-to-end, smoke test, write README |

### Invocation Sequence

```
User: @setup-agent        → autonomous → commit
User: @impl-agent         → proposes each file → user approves → commit per file
User: @test-agent         → autonomous → tests must pass → commit
User: @integration-agent  → proposes wiring → user approves → final commit
```

### Why Sequential?

- Only 6 source files, all share `types.ts` — file dependencies prevent parallel execution.
- Risk 2 does not require isolated contexts.
- Fleet (`/fleet`) and Delegate (`/delegate`) are reserved for future feature work when independent use cases are added.

### Future: Fleet Pattern

When new features are added (e.g., real API provider, additional tools), each independent feature will be assigned to a parallel subagent via `/fleet`. This will validate the parallel orchestration pattern on this same codebase.
