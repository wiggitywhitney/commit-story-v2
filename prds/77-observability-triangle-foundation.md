# PRD #77: Observability Triangle Foundation

**Status:** Active
**Created:** 2026-06-18
**GitHub Issue:** [#77](https://github.com/wiggitywhitney/commit-story-v2/issues/77)

---

## Problem Statement

commit-story-v2 uses `console.log` for all output. This means structured logs contain no trace context and cannot be correlated with spans in Datadog — the logs leg of the observability triangle is missing. A separate issue exists in the otelcol-config: a filelog receiver approach was drafted that reads from a tee'd file, but this is fragile, mixes JSON and plain-text lines, and requires application-level changes that belong in instrument branches rather than in the application foundation.

The goal of this PRD is to establish commit-story-v2 as a proper observability triangle demo target — one where logs, traces, and metrics are all correlated in Datadog. This foundation goes on `main` so that every spiny-orb eval run inherits it automatically. The demo story then becomes: "here is the infrastructure you set up once in your codebase; when spiny-orb runs on top of it, your existing logs automatically gain trace context."

## What Is Already In Place

- **Weaver schema attributes**: `commit_story.context.messages_filtered` (int) and `commit_story.context.substantial_messages` (int) are already defined in `telemetry/registry/attributes.yaml` — no schema work needed.
- **`service.instance.id`**: Already on main — implemented and merged before this PRD was created.
- **`forceFlush` before process exit**: Already in `examples/instrumentation.js` from issue #926. Not a milestone here.
- **spanmetrics + datadog/connector**: Already configured in `spinybacked-orbweaver-eval/evaluation/is/otelcol-config.yaml`. Derives RED metrics from spans. Not touched by this PRD.
- **Issue #952** (`forceFlush` for taze and release-it eval forks): Applies only to other eval target repos, not commit-story-v2. Not relevant here.

## Solution

Replace `console.log` with **pino** and add the **`@opentelemetry/instrumentation-pino`** bridge. When the OTel SDK is initialized (instrument branch active), the pino bridge automatically injects `trace_id` and `span_id` into every log record emitted within an active span. Logs continue to flow to stdout for the developer; they also flow via OTLP to the Collector and on to Datadog.

When no SDK is initialized (plain `main` branch), logs behave exactly as before — they just go to stdout without trace context. The developer does not need to change how they write logs. The correlation happens for free when spiny-orb's instrumentation is active.

On the Collector side: replace the filelog receiver (which polls a tee'd file) with an OTLP logs pipeline that receives log records via the same OTLP endpoint already used for traces.

## Rejected Alternatives

**`console.log` + `trace.getActiveSpan()` inline** — Adding log emission directly in span callbacks using `span.spanContext()` only works inside the instrumented code paths. It cannot be placed on `main` because `main` has no spans. Placing it in instrument branches violates separation of concerns — every new spiny-orb run would produce a fresh instrument branch that lacks the log emission. Rejected.

**`tee` to file + filelog receiver** — Requires running commit-story with a shell pipe (`| tee /tmp/commit-story.log`). The log file contains mixed JSON and plain-text lines; the `json_parser` operator fails on plain-text lines unless `on_error: drop` is added. The approach is fragile and does not use the OTLP path that traces already use. Rejected.

**Logging via `@opentelemetry/sdk-logs` + `OTLPLogExporter` with manual log emission** — The bridge approach (instrumentation-pino) is cleaner: the developer writes pino normally, and the bridge handles both stdout transport and OTLP transport. Manual `LogRecord` emission would require application code to know about OTel. Rejected.

## Technical Notes

- `@opentelemetry/instrumentation-pino` works by monkey-patching pino at load time. The SDK must be initialized (via `--import examples/instrumentation.js`) before pino is `require`d. Existing startup order in `examples/instrumentation.js` handles this correctly.
- Pino logs will appear in two places: stdout (unchanged for developers) and the OTLP logs pipeline (new, flows to Datadog). This is expected behavior.
- The OTLP logs pipeline in `otelcol-config.yaml` receives on the same `0.0.0.0:4318` endpoint as traces — no new port needed. The Collector's OTLP receiver already handles multi-signal.
- `@opentelemetry/api` is the correct peer dependency for application code that uses `trace.getActiveSpan()` — the lightweight no-op contract, not the SDK. The pino bridge approach does not require this at all in application code, since the bridge is registered in the bootstrap.

## Scope Boundary

This PRD does not instrument any application logic. It only sets up the logging infrastructure. The actual log emission calls (what to log at each span site) are left to the developer's normal use of pino. The observability triangle demo uses the existing span attributes (`commit_story.ai.section_type`, `gen_ai.request.model`) that spiny-orb's instrument branches provide.

---

## Milestones

- [x] **M1: Switch to pino and add OTel log bridge**
**Step 0 (pre-research):** Read related research before starting: [Research: pino](../docs/research/pino.md)

  Replace `console.log` calls with pino throughout `src/`. Add `pino` as a dependency. Add `@opentelemetry/instrumentation-pino` as a dependency.

  Step 0: Check for and delete the stale branch `feature/observability-triangle-demo` in this repo. That branch contains the rejected approach (process.stdout.write inside span callbacks). Run `git branch -d feature/observability-triangle-demo` locally; if it was pushed to remote, also run `git push origin --delete feature/observability-triangle-demo`. Do not use it as reference — the approach it took is explicitly rejected (see Rejected Alternatives section).

  Step 1: Run `/research pino` to verify current best practices and API surface before writing any code.

  Step 2: Audit all `console.log` / `console.error` / `console.warn` calls in `src/` (not tests) and replace with pino equivalents. Create a shared logger instance at `src/logger.js` that the rest of the codebase imports. Configure pino for JSON output (`{ transport: undefined }` — the default is already JSON in production mode; confirm this during the research step). Do not modify files under `tests/`, `examples/`, or `node_modules/`. Note: for calls like `console.error(someError)` that pass an Error object, use pino's convention: `logger.error({ err: someError }, 'descriptive message')` — pino serializes Error objects into a structured `err` field; passing the Error as the first argument without a message key loses the structure.

  Step 3: Verify logs still reach stdout and that no application behavior changes.

  Acceptance: `npm test` passes. No `console.log` / `console.error` / `console.warn` calls remain in `src/` (grep to verify). Pino logs appear on stdout as JSON lines.

- [ ] **M2: Add OTLP log exporter to the OTel SDK bootstrap**

  Step 0: Read the existing `examples/instrumentation.js` in full before writing any code. The file already contains `forceFlush`, `resourceFromAttributes`, and a `NodeSDK` configuration — do NOT rewrite it from scratch. Add the log exporter and pino bridge to what is already there.

  Update `examples/instrumentation.js` (the OTel SDK bootstrap at the repo root) to:
  1. Import `LoggerProvider`, `SimpleLogRecordProcessor` from `@opentelemetry/sdk-logs` and `OTLPLogExporter` from `@opentelemetry/exporter-logs-otlp-http`
  2. Create a `LoggerProvider` with a `SimpleLogRecordProcessor` wrapping an `OTLPLogExporter` pointed at `http://localhost:4318/v1/logs` (same host/port as the trace exporter)
  3. Call `logs.setGlobalLoggerProvider(loggerProvider)` to register it
  4. Add `PinoInstrumentation` from `@opentelemetry/instrumentation-pino` to the `instrumentations` array in the `NodeSDK` config

  Use `SimpleLogRecordProcessor`. Do NOT use `BatchLogRecordProcessor` — commit-story is a CLI app that exits after a run, and batch processors may not flush before process exit. `SimpleLogRecordProcessor` exports each log record immediately.

  Read both `~/.claude/rules/otel-logs-bridge-gotchas.md` and `~/.claude/rules/datadog-log-trace-gotchas.md` before writing any code. The first covers SDK initialization order and the experimental status of `@opentelemetry/sdk-logs`. The second covers how Datadog correlates OTel `trace_id`/`span_id` fields (no 64-bit decimal conversion needed, OTel native format accepted natively) and the `service.name` remapping limitation.

  **`service.name` remapping note**: OTel resource attributes (including `service.name`, `service.version`, `deployment.environment`) are NOT automatically converted to Datadog's unified service tags in the log pipeline. Logs will appear in Datadog Logs Explorer but may not be tagged with `service:commit-story` by default, which affects the "View related logs" navigation from APM traces. Per `~/.claude/rules/datadog-log-trace-gotchas.md`: configure manual attribute remapping via Datadog Log Profiles or "Preprocessing for JSON logs" if the service tag is absent. Document this as a known limitation in the M4 verification notes if it applies.

  Acceptance: When commit-story runs with `--import examples/instrumentation.js` and the OTel Collector is running, log records appear in Datadog Logs Explorer with `trace_id` and `span_id` fields populated on log lines emitted during active spans.

- [ ] **M3: Update otelcol-config.yaml — replace filelog with OTLP logs pipeline**

  This milestone is in a **different repository**: `wiggitywhitney/spinybacked-orbweaver-eval`, located at `~/Documents/Repositories/spinybacked-orbweaver-eval/` on the development machine. The file to edit is `evaluation/is/otelcol-config.yaml` in that repo. Work on a feature branch in that repo, not in commit-story-v2.

  Changes to make:
  1. Remove the `filelog` receiver block entirely
  2. Remove the `logs` pipeline that reads from `[filelog]`
  3. Add a new `logs` pipeline: `receivers: [otlp]`, `exporters: [datadog]`
  4. Update the comment block at the top of the file to remove all references to the filelog/tee approach and replace with a note that logs flow via OTLP from the pino bridge

  Note: The `otlp` receiver already handles OTLP traces on port 4318. OTLP logs from the pino bridge use the same receiver and port — the Collector routes by signal type. No new port or receiver block is needed.

  **Warning**: `otelcol-config.yaml` is the shared config for all eval targets (commit-story-v2, taze, release-it). Changes to this file affect every target. The filelog receiver is commit-story-v2-specific — removing it does not affect the other targets. The OTLP logs pipeline addition is also harmless for other targets (they simply won't emit OTLP logs if their bootstrap doesn't include a log exporter). Do NOT modify the `traces` or `metrics` pipeline blocks — only the `logs` pipeline changes.

  Acceptance: `otelcol-contrib --config evaluation/is/otelcol-config.yaml` starts without errors. No `filelog` receiver or tee instructions remain in the file.

- [ ] **M4: Verify end-to-end observability triangle**

  Start the OTel Collector before running commit-story (requires `DD_API_KEY` from `~/.vals.yaml` in `spinybacked-orbweaver-eval`):

  ```bash
  vals exec -f ~/Documents/Repositories/spinybacked-orbweaver-eval/.vals.yaml -- bash -c 'export PATH="/opt/homebrew/bin:$PATH" && otelcol-contrib --config ~/Documents/Repositories/spinybacked-orbweaver-eval/evaluation/is/otelcol-config.yaml > /tmp/otelcol.log 2>&1' &
  until lsof -i :4318 >/dev/null 2>&1; do sleep 0.5; done
  ```

  Run commit-story twice and confirm each leg of the triangle in Datadog:

  **Context**: This verification is the "before and after" comparison that forms the demo. The demo is ~20 minutes and spiny-orb takes ~40 minutes to run, so spiny-orb will NOT run live — Whitney will have a pre-run instrument branch ready before the demo. The before state is main; the after state is switching to the instrument branch. M4 should confirm both states are demo-ready in Datadog, not just technically functional.

  **Without spiny-orb instrumentation (main branch):**
  ```bash
  node --import ./examples/instrumentation.js ./src/index.js
  ```
  Note: The OTel SDK is still loaded via `--import` on main — this is intentional. The pino bridge is registered, but because no span instrumentation exists on main, there are no active spans when log lines are emitted. Pino logs will appear in Datadog with no `trace_id` / `span_id` because there is nothing to correlate with. This is the expected "before" state.
  - Logs appear in Datadog Logs Explorer with pino JSON fields (`msg`, `level`, `time`) and no `trace_id` / `span_id`
  - No APM traces (expected — no spans emitted on main)

  **With spiny-orb instrumentation (latest instrument branch, e.g. `spiny-orb/instrument-<timestamp>`):**
  ```bash
  node --import ./examples/instrumentation.js ./src/index.js
  ```
  - APM traces appear with `commit_story.ai.section_type` attributes on section generation spans
  - Logs appear with `trace_id` and `span_id` fields populated on lines emitted during active spans
  - From the APM trace view, "View related logs" navigation shows the correlated log lines
  - spanmetrics-derived metrics appear in Datadog with `commit_story.ai.section_type` as a dimension

  Acceptance: All three legs are live and navigable from each other in Datadog UI. Update `PROGRESS.md` following the repo's existing keep-a-changelog format (entry under `## [Unreleased]`, appropriate section heading).

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-18 | Pino + instrumentation-pino over console.log | Bridge approach is correct: developer writes pino normally, trace context injects automatically when spans are active. No application-level span.spanContext() calls needed. |
| 2026-06-18 | OTLP logs pipeline over filelog receiver | Logs should travel via the same OTLP path as traces. The filelog approach requires a tee pipe, fails on mixed JSON/plain-text stdout, and is fragile. |
| 2026-06-18 | Changes go on main, not instrument branches | Instrument branches are generated by spiny-orb and are ephemeral. Infrastructure (logging, schema) must be on main so every spiny-orb run inherits it. |
| 2026-06-18 | Weaver schema attributes already in place | commit_story.context.messages_filtered and commit_story.context.substantial_messages are defined in telemetry/registry/attributes.yaml. No schema work needed in this PRD. |
