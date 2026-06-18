# Research: pino

**Project:** commit-story-v2
**Last Updated:** 2026-06-18

## Update Log
| Date | Summary |
|------|---------|
| 2026-06-18 | Initial research — pino v10, ESM compatibility, OTel instrumentation-pino version range, MCP server stderr constraint |

## Findings

### Current Version
- **pino**: v10.3.1 (published Feb 2026)
- **@opentelemetry/instrumentation-pino**: v0.65.0
- pino v10 supported range for instrumentation-pino: `>=5.14.0 <11`

### Default Output Format
JSON lines to stdout:
```json
{"level":30,"time":1531257112193,"msg":"hello world","pid":55956,"hostname":"x"}
```
Level is numeric: 10=trace, 20=debug, 30=info, 40=warn, 50=error, 60=fatal.

### ESM Compatibility
- `import pino from 'pino'` works in `"type": "module"` projects ✅
- pino is internally CJS but exports correctly for ESM default imports
- **Caveat**: `pino.transport()` (worker-thread transports) has known issues with `"type": "module"` + `thread-stream`. We are NOT using transports for M1 (default stdout is fine), so this is a non-issue.

### Node.js Version Requirement
pino v10 requires `^18.19.0 || >=20.6.0` — dropped support for Node 18.0–18.18.
Project `engines` says `>=18.0.0` — update to `^18.19.0 || >=20.6.0` to match.

### Shared Logger Pattern (ESM)
```js
// src/logger.js
import pino from 'pino';
export default pino({ level: process.env.LOG_LEVEL ?? 'info' });
```
No transport configuration needed — pino's default writes JSON to stdout.

### MCP Server Constraint
`src/mcp/server.js` uses stdout for JSON-RPC protocol. Any logging MUST go to stderr.
Configure a separate pino logger for the MCP server:
```js
import pino from 'pino';
const logger = pino({ level: 'info' }, process.stderr);
```
This is a supported pino pattern — the second argument is the destination stream.

### Error Object Serialization
Both forms work and produce an `err` field in JSON output:
```js
logger.error(err, 'message');          // idiomatic pino
logger.error({ err }, 'message');     // explicit merge object
```
pino auto-wraps Error objects passed as the first merging argument into `{ err }`.

### Child Loggers
```js
const childLogger = logger.child({ requestId: '123' });
childLogger.info('handled request');
// Output: {..., "requestId": "123", "msg": "handled request"}
```
Binds fields to all logs from that logger without repeating at each call site.

### v10 Breaking Changes from v9
Only breaking change: drops Node 18.0–18.18. No API changes.

## Sources
- [pino GitHub releases](https://github.com/pinojs/pino/releases) — v10.0.0 changelog confirming Node 18 drop as only breaking change
- [instrumentation-pino README (main)](https://raw.githubusercontent.com/open-telemetry/opentelemetry-js-contrib/main/packages/instrumentation-pino/README.md) — supported pino range `>=5.14.0 <11`, verified current as of 2026-06-18
- [BetterStack pino guide](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) — ESM import pattern and Error serialization
- pino API docs (api.md) — Error wrapping behavior
