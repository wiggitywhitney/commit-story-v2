# PRD: OTel SDK Setup for Local Telemetry and Datadog Export

**Status:** Draft
**Created:** 2026-03-21
**GitHub Issue:** #51
**Priority:** High (demo in 2 days)

---

## Problem Statement

commit-story-v2 is about to be instrumented by spiny-orb (the AI telemetry agent). The agent adds manual spans using `@opentelemetry/api` — but without an SDK running, those calls are **no-ops** that produce nothing. The OTel API is designed this way: libraries instrument with the API, deployers provide the SDK ([OTel Library Guidelines](https://opentelemetry.io/docs/concepts/instrumentation/libraries/)).

To validate that the instrumentation actually works and to demo real telemetry in Datadog:
1. The SDK must be bootstrapped at startup
2. An OTLP exporter must send traces to Datadog
3. The auto-instrumentation packages recommended by spiny-orb (LangChain, MCP) should be installed so LLM calls become child spans automatically

commit-story-v2 is a **library** (has `main`, `bin`, `exports` in package.json) that is `npm link`'d globally. The global CLI (`/opt/homebrew/bin/commit-story`) symlinks directly to the local repo. Whatever branch is checked out runs live on every git commit across all repos. This means SDK setup in devDependencies works — it's available locally but not distributed to consumers.

### Why Now

- Spiny-orb evaluation run-9 will target this repo (not the eval copy) for the first time
- A presentation demo in ~2 days needs to show real Datadog traces from instrumented commit-story
- 8 evaluation runs have validated the code quality; this is the first time we validate runtime telemetry

---

## Solution Overview

### Architecture

```text
commit-story CLI (npm link'd)
  └─ src/instrumentation.js (loaded via --import flag)
       ├─ NodeSDK from @opentelemetry/sdk-node
       ├─ OTLPTraceExporter → localhost:4318 (DD Agent)
       ├─ @traceloop/instrumentation-langchain (auto-spans for LLM calls)
       └─ @traceloop/instrumentation-mcp (auto-spans for MCP protocol)

Datadog Agent (Docker container)
  └─ OTLP receiver on port 4318 (HTTP)
       └─ Forwards traces to Datadog APM
```

### Key Technical Decisions

**DD Agent vs Direct Intake**: Datadog's direct OTLP traces intake is in **Preview** and requires CSM access ([Datadog OTLP Intake docs](https://docs.datadoghq.com/opentelemetry/setup/otlp_ingest/)). The DD Agent approach is GA, simpler, and handles authentication/enrichment automatically. Use DD Agent via Docker.

**devDependencies, not dependencies**: The SDK and exporter are dev/local concerns. The library's consumers don't need them. `@opentelemetry/api` stays in peerDependencies (correct for libraries). Everything else goes in devDependencies.

**HTTP over gRPC for OTLP**: HTTP is simpler, works everywhere, and Datadog supports both on the same agent. Port 4318 for HTTP. No need for gRPC complexity in a local dev setup.

**--import flag for SDK loading**: OTel must initialize before application code runs. Node.js `--import` flag loads the instrumentation module first. The git hook script needs to include this flag.

### Packages to Install

| Package | Type | Purpose |
|---------|------|---------|
| `@opentelemetry/sdk-node` | devDependency | SDK bootstrap (NodeSDK class) |
| `@opentelemetry/exporter-trace-otlp-http` | devDependency | OTLP HTTP exporter for traces |
| `@opentelemetry/resources` | devDependency | Resource attributes (service.name, etc.) |
| `@opentelemetry/semantic-conventions` | devDependency | Standard attribute constants |
| `@traceloop/instrumentation-langchain` | devDependency | Auto-instrumentation for LangChain/LangGraph LLM calls |
| `@traceloop/instrumentation-mcp` | devDependency | Auto-instrumentation for MCP protocol |

Note: `@opentelemetry/api` is already expected as a peerDependency once spiny-orb instruments the code. It should be added now so the SDK can reference it.

### Datadog Agent Setup

Docker container with OTLP enabled:
```bash
docker run -d --name dd-agent \
  -e DD_API_KEY=<from-vals> \
  -e DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_HTTP_ENDPOINT=0.0.0.0:4318 \
  -e DD_SITE=datadoghq.com \
  -p 4318:4318 \
  gcr.io/datadoghq/agent:latest
```

The agent is off by default for OTLP — the `DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_HTTP_ENDPOINT` env var enables it ([Datadog OTLP Agent docs](https://docs.datadoghq.com/opentelemetry/setup/otlp_ingest_in_the_agent/)).

---

## Success Criteria

1. `src/instrumentation.js` bootstraps NodeSDK with OTLP exporter and auto-instrumentation packages
2. `@opentelemetry/sdk-node`, exporter, and auto-instrumentation packages in devDependencies
3. `@opentelemetry/api` in peerDependencies (for spiny-orb compatibility)
4. Datadog Agent Docker container starts with OTLP HTTP receiver on 4318
5. DD API key injected via vals (not hardcoded)
6. Git hook updated to use `--import ./src/instrumentation.js` flag
7. Making a real commit in any repo produces traces visible in Datadog APM within 60 seconds
8. LangChain LLM calls appear as child spans under the manual instrumentation spans
9. Service name `commit-story` appears in Datadog APM service catalog
10. Teardown script stops and removes the DD Agent container

---

## Milestones

- [x] **Install OTel packages** — Add SDK, exporter, resource, semantic conventions, and auto-instrumentation packages to devDependencies. Add `@opentelemetry/api` to peerDependencies.

- [x] **Create instrumentation.js bootstrap** — NodeSDK with OTLPTraceExporter pointing to `http://localhost:4318`, resource attributes (service.name, service.version, deployment.environment), auto-instrumentation packages, and graceful shutdown handlers.

- [x] **Datadog Agent setup/teardown scripts** — Docker-based DD Agent with OTLP enabled. `scripts/setup-dd-agent.sh` to start, `scripts/teardown-dd-agent.sh` to stop. DD API key via vals.

- [x] **Package distribution hygiene** — Ensure OTel tooling does not bloat the npm package. No `"files"` field or `.npmignore` exists today, so everything in `src/` ships. Either: (a) add a `"files"` whitelist to package.json that excludes `instrumentation.js`, or (b) move `instrumentation.js` out of `src/` (e.g., `dev/instrumentation.js`) so it's naturally outside the distribution path. Verify with `npm pack --dry-run` that the tarball does not include instrumentation.js or any OTel SDK code. **This milestone must complete before the git hook milestone** so the final path is known. (Updated per Decision 2: instrumentation.js must not ship)

- [x] **Update git hook for SDK loading** — Modify `scripts/install-hook.sh` and the post-commit hook template to include `--import <path-to-instrumentation.js>` so the SDK initializes before commit-story runs. Use the final path determined by the package distribution hygiene milestone — if the file moved out of `src/`, the `--import` path must match. (Updated per Decision 2: path depends on where file lands)

- [x] **End-to-end validation** — Start DD Agent, make a commit in any repo, verify traces appear in Datadog APM with correct service name, span hierarchy, and LangChain child spans.

- [x] **Remove sdk-node from peerDependencies in eval repo** — Clean up the eval repo's pre-existing scaffolding now that the real setup is on commit-story-v2 proper. Close issue commit-story-v2-eval#23.

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| DD Agent Docker not available | Provide instructions for `brew install datadog-agent` as alternative |
| Auto-instrumentation packages conflict with spiny-orb output | Test with and without — spiny-orb's manual spans should coexist with auto-instrumentation |
| --import flag breaks existing git hook behavior | Test hook manually before and after change |
| DD API key exposure | Use vals for injection, never hardcode |
| Port 4318 conflict with existing service | Check port availability in setup script |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-21 | sdk-node in devDependencies, not peerDependencies | commit-story-v2 is a library. Libraries depend only on @opentelemetry/api (peerDependency). The SDK is a deployer concern. devDependencies keeps it available locally for dev/demo without distributing to consumers. The eval repo had it in peerDependencies as scaffolding — that was wrong and caused API-004 failures across 7 eval runs. |
| 2026-03-21 | instrumentation.js must not ship in npm package | No `"files"` field or `.npmignore` exists, so everything in `src/` ships. instrumentation.js is SDK bootstrap code for local dev/demo, not library functionality. Either move out of `src/` or add a `"files"` whitelist. Verify with `npm pack --dry-run`. |
| 2026-03-21 | DD Agent via Docker, not direct OTLP intake | Datadog's direct OTLP traces intake is Preview-only and requires CSM access. DD Agent OTLP ingestion is GA. Docker container is simplest for local dev — one command to start, one to stop. |
| 2026-03-21 | HTTP (port 4318), not gRPC for OTLP export | HTTP is simpler, works everywhere, no extra dependencies. Both are config changes if we need to switch later. |
| 2026-03-21 | This setup enables spiny-orb eval run-9 on the real repo | The eval repo (commit-story-v2-eval) PRD #9 depends on this PRD completing first. Run-9 will be the first evaluation against the real codebase instead of an eval fork, and the first time live Datadog traces are validated. |

---

## Research References

- [OTel Library Instrumentation Guidelines](https://opentelemetry.io/docs/concepts/instrumentation/libraries/) — "Libraries should only use the OpenTelemetry API"
- [OTel JS API no-op behavior](https://github.com/open-telemetry/opentelemetry-js-api) — API provides no-op implementations without SDK
- [Datadog OTLP Agent Ingestion](https://docs.datadoghq.com/opentelemetry/setup/otlp_ingest_in_the_agent/) — OTLP off by default, enable with env vars, ports 4317 (gRPC) / 4318 (HTTP)
- [Datadog OTLP Direct Intake](https://docs.datadoghq.com/opentelemetry/setup/otlp_ingest/) — Traces intake is Preview-only, metrics/logs GA
- [@opentelemetry/exporter-trace-otlp-http npm](https://www.npmjs.com/package/@opentelemetry/exporter-trace-otlp-http) — Default endpoint `http://localhost:4318/v1/traces`
- [OTel OTLP Exporter Configuration](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/) — Standard env var configuration
- [Datadog Unified Service Tagging](https://docs.datadoghq.com/getting_started/tagging/unified_service_tagging/) — service.name, deployment.environment, service.version

---

## Prior Art

- **commit-story-v2-eval**: Has `src/instrumentation.js` and `@opentelemetry/sdk-node` in peerDependencies as evaluation scaffolding (added in PRD #3). This PRD does it properly — devDependencies with a real exporter.
- **spinybacked-orbweaver**: The AI instrumentation agent. PR summary recommends `@traceloop/instrumentation-langchain` and `@traceloop/instrumentation-mcp` as companion packages.
- **8 evaluation runs** (runs 2-8): Validated code-level quality of spiny-orb's output. This PRD enables runtime validation for the first time.
