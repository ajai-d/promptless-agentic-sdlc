# Specification — Top Stocks MCP Server

> **Seed:** An MCP server that returns the top 5 performing stocks of the day, with a client and a simple UI to display the results.

---

## 1b. Business Requirements (BRD)

### Goal

Provide a developer-facing demonstration of the Model Context Protocol (MCP) by building a working server that returns real-time-shaped stock data, paired with a client and UI — proving the end-to-end MCP tool-call flow.

### Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| Developer (primary) | Learn MCP patterns; have a reference implementation to fork |
| Future integrator | Swap mock data for a real API (Yahoo Finance) without rewriting server logic |

### Success Metrics

- A working `npm install && npm start` experience with zero external dependencies
- Clear separation between data source and protocol layer (provider swap = one file change)
- Complete reference for MCP tool authoring (server + client + UI)

### Constraints & Assumptions

- Runs entirely locally — no cloud services, API keys, or accounts required
- TypeScript throughout for type safety and tooling consistency
- Mock data only in v1; real API integration deferred

---

## 1c. Use Cases

| UC | Actor | Trigger | Main Flow | Exceptions | Complexity |
|:--:|-------|---------|-----------|------------|:----------:|
| UC-1 | Developer | Defines data contract | Create `StockProvider` interface and `Stock` type so any data source can plug in | None | Low |
| UC-2 | Developer | Needs test data | Implement `MockProvider` returning 5 hardcoded stocks with realistic values | Provider fails to return exactly 5 | Low |
| UC-3 | Developer | Wants MCP server running | Create MCP server exposing `get_top_stocks` tool; supports stdio (default) and SSE (`TRANSPORT=sse`) | Transport initialization failure | Medium |
| UC-4 | Client app | Needs stock data | TypeScript MCP client connects via stdio, calls `get_top_stocks`, receives `Stock[]` | Connection timeout; malformed response | Low |
| UC-5 | End user | Views stock data | HTML page renders 5-row table (ticker, name, price, % change) from client output | Empty response; render failure | Low |
| UC-6 | Developer | Validates correctness | Unit tests verify provider contract (returns 5 stocks) and tool response shape | Test failures trigger fix cycle | Low |
| UC-7 | Developer | Onboards to project | README documents setup, run, test, and provider-swap instructions | N/A | Low |

**Dependency graph:**
```
UC-1 → UC-2 → UC-3 → UC-4 → UC-5
  ↓                         ↗
UC-6 ───────────────────────┘
UC-7 (after all)
```

---

## 1d. Technical Specification

### Functional Requirements

| ID | Requirement | Traces to |
|----|-------------|-----------|
| FR-1 | MCP server exposes a `get_top_stocks` tool returning 5 stock objects (ticker, company name, price, % change) | UC-3 |
| FR-2 | Data layer abstracted behind a `StockProvider` interface so mock can be swapped without changing server logic | UC-1 |
| FR-3 | Mock provider returns realistic hardcoded data (5 stocks with tickers, prices, % gains) | UC-2 |
| FR-4 | TypeScript MCP client connects to the server and calls `get_top_stocks` | UC-4 |
| FR-5 | Web UI displays results in a clean HTML table (ticker, name, price, % change) | UC-5 |

### Non-Functional Requirements

| ID | Requirement | Traces to |
|----|-------------|-----------|
| NFR-1 | TypeScript throughout (server, client, UI tooling) | Constraint |
| NFR-2 | Runs locally with `npm install` + `npm start` — no external services required | Constraint |
| NFR-3 | Data provider interface documented so future integration is straightforward | UC-7 |

### Acceptance Criteria

| ID | Criterion | Traces to |
|----|-----------|-----------|
| AC-1 | `npm install && npm start` launches the MCP server successfully | FR-1, NFR-2 |
| AC-2 | Client connects and receives exactly 5 stock entries | FR-4, UC-4 |
| AC-3 | UI renders a table with columns: Ticker, Name, Price, Change % | FR-5, UC-5 |
| AC-4 | All unit tests pass (`npm test`) | UC-6 |
| AC-5 | README documents setup, run, and how to swap data providers | UC-7, NFR-3 |

### Out of Scope

- Authentication / authorization
- Persistent storage / database
- Real-time streaming or WebSocket updates
- Cloud deployment
- Real API integration (deferred to v2)

### Open Questions

- None
