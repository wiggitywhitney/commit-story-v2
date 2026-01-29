# Commit Story Architecture Analysis

A deep technical analysis for the KubeCon EU 2026 talk "When the Codebase Starts Instrumenting Itself"

---

## 1. Architecture Map

### System Overview

Commit Story is an automated engineering journal system triggered by git commits. It collects git diffs, commit messages, and Claude Code chat history, then uses AI to generate narrative journal entries.

```
                    Git Hook Trigger (post-commit)
                              |
                              v
                    +-------------------+
                    |    src/index.js   |
                    |   (CLI Entry)     |
                    +-------------------+
                              |
           +------------------+------------------+
           |                                     |
           v                                     v
+---------------------+              +----------------------+
| collectors/         |              | integrators/         |
| - git-collector.js  |              | context-integrator.js|
| - claude-collector.js              | (orchestrates)       |
+---------------------+              +----------------------+
           |                                     |
           +------------------+------------------+
                              |
                              v
                    +-------------------+
                    | generators/       |
                    | - journal-generator.js (orchestrator)
                    | - summary-generator.js
                    | - dialogue-generator.js
                    | - technical-decisions-generator.js
                    +-------------------+
                              |
                              v
                    +-------------------+
                    | managers/         |
                    | journal-manager.js|
                    +-------------------+
                              |
                              v
                    journal/entries/YYYY-MM/YYYY-MM-DD.md
```

### Module Responsibilities

| Module | Location | Responsibility |
|--------|----------|----------------|
| **Entry Point** | `src/index.js` | CLI parsing, orchestration, validation, process lifecycle |
| **Git Collector** | `src/collectors/git-collector.js` | Extracts commit data (hash, message, author, timestamp, diff) |
| **Claude Collector** | `src/collectors/claude-collector.js` | Reads Claude Code JSONL files, filters by repo path and time window, groups by session |
| **Context Integrator** | `src/integrators/context-integrator.js` | Orchestrates collectors, extracts text, calculates metadata, applies filtering |
| **Context Filter** | `src/generators/filters/context-filter.js` | Token management, removes noisy messages (tool calls, system), truncates large content |
| **Sensitive Data Filter** | `src/generators/filters/sensitive-data-filter.js` | Redacts API keys, JWTs, emails |
| **Journal Generator** | `src/generators/journal-generator.js` | Orchestrates AI sections with parallel/sequential execution |
| **Summary Generator** | `src/generators/summary-generator.js` | AI-generated narrative summary |
| **Dialogue Generator** | `src/generators/dialogue-generator.js` | AI-extracted human quotes from chat |
| **Technical Decisions Generator** | `src/generators/technical-decisions-generator.js` | AI-extracted technical decisions |
| **Journal Manager** | `src/managers/journal-manager.js` | File writing, reflection discovery, entry formatting |
| **MCP Server** | `src/mcp/server.js` | Model Context Protocol server for Claude Code integration |
| **Reflection Tool** | `src/mcp/tools/reflection-tool.js` | Real-time reflection capture |
| **Context Tool** | `src/mcp/tools/context-capture-tool.js` | Working memory capture |
| **Telemetry Standards** | `src/telemetry/standards.js` | OpenTelemetry conventions, span/attribute builders, metrics |
| **Tracing** | `src/tracing.js` | OTel SDK initialization, OTLP exporters |
| **Logging** | `src/logging.js` | OTel Log Provider, OTLP log exporter |

### Data Flow

1. **Trigger**: Git post-commit hook calls `node src/index.js`
2. **Collection**:
   - `git-collector` runs `git show` and `git diff-tree` for commit data
   - `claude-collector` reads `~/.claude/projects/*/` JSONL files
3. **Correlation**: `context-integrator` filters chat by time window between commits
4. **Filtering**: `context-filter` removes tool calls, system messages; applies token limits
5. **Generation**: Three AI sections generated (summary + technical in parallel, then dialogue with summary)
6. **Saving**: `journal-manager` writes to `journal/entries/YYYY-MM/YYYY-MM-DD.md`

---

## 2. Core Logic Inventory

### Business Logic (What the App Does)

| Function | Module | Pure Business Logic |
|----------|--------|---------------------|
| `extractChatForCommit` | claude-collector | Read JSONL files, filter by cwd and time window |
| `getLatestCommitData` | git-collector | Run git commands, parse output |
| `gatherContextForCommit` | context-integrator | Orchestrate collection, flatten sessions, apply filters |
| `filterChatMessages` | context-filter | Remove tool calls, system messages, truncate large content |
| `filterContext` | context-filter | Token budget management, aggressive filtering |
| `generateSummary` | summary-generator | Send context to OpenAI, return narrative |
| `generateDevelopmentDialogue` | dialogue-generator | Extract human quotes with AI |
| `generateTechnicalDecisions` | technical-decisions | Extract decisions with AI |
| `saveJournalEntry` | journal-manager | Write markdown file, discover reflections |
| `analyzeCommitContent` | commit-content-analyzer | Categorize files as code vs docs |
| `formatSessionsForAI` | session-formatter | Transform sessions for prompt construction |

### Infrastructure Code (Boilerplate)

| Category | Approximate Lines | Purpose |
|----------|-------------------|---------|
| Telemetry spans/attributes | ~40% of each module | Wraps every function |
| Error handling | ~15% | try/catch with span recording |
| Logging (narrative logger) | ~10% | Progress tracking for debugging |
| Config reading | ~5% | Debug/dev mode detection |
| Metric emission | ~10% | Dual emission pattern |

### Key Insight: Business Logic vs Instrumentation Ratio

Looking at a typical module like `claude-collector.js`:
- **Total lines**: ~280
- **Pure business logic**: ~80 lines (finding files, parsing JSONL, filtering, grouping)
- **Telemetry wrapping**: ~120 lines (spans, attributes, metrics, logging)
- **Infrastructure**: ~80 lines (imports, config, error handling)

**The business logic is ~30% of each file. Telemetry is ~40%.**

This heavy instrumentation ratio is intentional. The thesis was that development-time telemetry gives AI assistants real data to validate assumptions.

---

## 3. Telemetry Design Patterns

### The Standards Module (`src/telemetry/standards.js`)

This is the core innovation. A 1000+ line module that centralizes ALL telemetry conventions:

```javascript
export const OTEL = {
  NAMESPACE: 'commit_story',

  // Span name builders (enforce naming)
  span: {
    main: () => 'commit_story.main',
    ai: {
      summary: () => 'summary.generate',
      dialogue: () => 'dialogue.generate',
      technical: () => 'technical_decisions.generate'
    },
    collectors: {
      claude: () => 'claude.collect_messages',
      git: () => 'git.collect_data'
    },
    // ... 50+ more span builders
  },

  // Attribute builders (enforce conventions)
  attrs: {
    genAI: {
      request: (model, temperature, msgCount) => ({
        'gen_ai.request.model': model,
        'gen_ai.request.temperature': temperature,
        'gen_ai.provider.name': getProviderFromModel(model)
      }),
      usage: (response) => ({
        'gen_ai.response.model': response.model,
        'gen_ai.usage.prompt_tokens': response.usage?.prompt_tokens
      })
    },
    commit: (data) => ({
      [`${OTEL.NAMESPACE}.commit.hash`]: data.hash,
      [`${OTEL.NAMESPACE}.commit.message`]: data.message?.split('\n')[0]
    }),
    // ... 30+ attribute builders
  },

  // Metrics with instrument caching
  metrics: {
    gauge: (name, value, attrs) => { /* cached instrument creation */ },
    counter: (name, value, attrs) => { /* enforces _total suffix */ },
    histogram: (name, value, attrs) => { /* cached histogram */ }
  }
}
```

### Philosophy Behind the Approach

1. **No Hardcoded Strings**: All span names and attributes use builders. This prevents typos and ensures consistency.

2. **Semantic Convention Compliance**: Follows OpenTelemetry v1.37.0 conventions:
   - `gen_ai.*` for AI operations (official GenAI conventions)
   - `code.function`, `code.filepath` for APM navigation
   - `rpc.*` for MCP operations
   - `commit_story.*` for application-specific attributes

3. **Dual Emission Pattern**: Every span also emits metrics:
   ```javascript
   span.setAttributes(attrs);  // Trace attributes
   Object.entries(attrs).forEach(([name, value]) => {
     OTEL.metrics.gauge(name, value);  // Also as metric
   });
   ```

4. **Narrative Logging**: A separate logging system (`trace-logger.js`) creates searchable logs with trace correlation:
   ```javascript
   logger.start('operation', 'Human-readable description');
   logger.progress('operation', 'Status update');
   logger.decision('operation', 'Why this path was taken');
   logger.complete('operation', 'Result summary');
   ```

### Span Patterns Used

| Pattern | Example | Purpose |
|---------|---------|---------|
| **Wrapping Functions** | Every exported function | Full trace coverage |
| **Nested Spans** | journal-generator calls summary-generator | Parent-child relationships |
| **Events** | `span.addEvent('phase1.start')` | Phase markers within spans |
| **Exception Recording** | `span.recordException(error)` | Error correlation |
| **Status Setting** | `span.setStatus({ code, message })` | Success/failure indication |

### Attribute Categories

1. **Official GenAI** (`gen_ai.*`): Model, tokens, provider
2. **Code Navigation** (`code.*`): Function name, filepath for APM
3. **RPC** (`rpc.*`): MCP server operations
4. **Application** (`commit_story.*`): Business metrics

---

## 4. Dependencies Analysis

### Production Dependencies (4 packages)

```json
{
  "@modelcontextprotocol/sdk": "^1.18.1",  // MCP server framework
  "@opentelemetry/api": "^1.9.0",          // OTel API (no SDK)
  "dotenv": "^17.2.2",                      // Env file loading
  "openai": "^5.19.1"                       // AI API client
}
```

**Weight Analysis**:
- `@modelcontextprotocol/sdk`: ~500KB (required for Claude Code integration)
- `@opentelemetry/api`: ~100KB (lightweight API-only)
- `dotenv`: ~50KB (minimal)
- `openai`: ~2MB (includes fetch polyfills, types)

### Dev Dependencies (9 OTel packages)

```json
{
  "@opentelemetry/api-logs": "^0.56.0",
  "@opentelemetry/auto-instrumentations-node": "^0.63.0",  // HEAVY
  "@opentelemetry/exporter-logs-otlp-http": "^0.205.0",
  "@opentelemetry/exporter-metrics-otlp-http": "^0.205.0",
  "@opentelemetry/exporter-trace-otlp-http": "^0.204.0",
  "@opentelemetry/resources": "^1.29.0",
  "@opentelemetry/sdk-logs": "^0.205.0",
  "@opentelemetry/sdk-metrics": "^2.1.0",
  "@opentelemetry/sdk-node": "^0.204.0"
}
```

**Weight Analysis**:
- `@opentelemetry/auto-instrumentations-node`: ~15MB (pulls in EVERYTHING)
- `@opentelemetry/sdk-node`: ~5MB
- Combined SDK packages: ~25MB in node_modules

### The SDK Bundling Issue

**Current approach**: SDK packages are devDependencies. In `tracing.js`:

```javascript
async function loadOTelSDK() {
  try {
    const modules = await Promise.all([
      import('@opentelemetry/sdk-node'),
      // ... other SDK imports
    ]);
    return modules;
  } catch (error) {
    return null;  // SDK not available (production install)
  }
}
```

**Problem**: Users installing `commit-story` as a dependency don't get telemetry unless they also install the SDK packages.

**Current workaround**: `dev: true` in config file triggers SDK initialization. Without it, telemetry is a no-op.

**Alternative considered**: Bundling SDK, but adds ~25MB to the package.

### What's Required vs Optional

| Package | Required For | Optional? |
|---------|-------------|-----------|
| `@modelcontextprotocol/sdk` | MCP server (reflections, context) | Could be optional |
| `@opentelemetry/api` | Telemetry (core feature) | Required for vision |
| `dotenv` | Environment variables | Required |
| `openai` | AI generation | Required |
| OTel SDK packages | Actual telemetry export | Optional (dev mode) |

---

## 5. What Modern Tooling Would Change

### LangChain/LangGraph Opportunities

**Current State**: Hand-rolled AI orchestration in `journal-generator.js`:

```javascript
// Phase 1: Parallel
const [summaryPromise, technicalPromise] = [
  generateSummary(context),
  generateTechnicalDecisions(context)
];
// Phase 2: Wait for summary
const summary = await summaryPromise;
// Phase 3: Sequential with summary
const dialogue = generateDevelopmentDialogue(context, summary);
```

**LangGraph Would Provide**:
1. **Declarative workflow graphs** instead of hand-coded orchestration
2. **Built-in retry logic** for AI calls
3. **Streaming support** for real-time output
4. **Checkpointing** for long-running workflows
5. **Better tool calling** abstraction

**LangChain Would Provide**:
1. **Prompt templates** with variable injection
2. **Output parsers** for structured responses
3. **Memory abstractions** for context management
4. **Document loaders** for git diffs
5. **Built-in tracing** (LangSmith integration)

### Current OTel Patterns vs Modern Options

**Current**: Manual instrumentation everywhere
```javascript
return tracer.startActiveSpan(OTEL.span.ai.summary(), {
  attributes: { ... }
}, async (span) => {
  // business logic
});
```

**Modern Options**:

1. **OpenTelemetry Instrumentation for LangChain**: Auto-instruments LangChain calls
2. **Vercel AI SDK**: Built-in streaming + telemetry
3. **OpenLLMetry**: Automatic GenAI instrumentation
4. **Traceloop SDK**: Standardized AI observability

### What Would Be Different Building Today

1. **Framework Choice**: LangGraph for orchestration instead of custom async code
2. **AI Calls**: Vercel AI SDK for streaming + built-in OTel
3. **Telemetry**: OpenLLMetry for automatic GenAI instrumentation
4. **MCP**: Likely same approach (MCP is still young)
5. **Standards Module**: Still valuable, but would leverage OTel Weaver for schema generation
6. **Prompt Engineering**: LangChain templates vs hand-coded strings

---

## 6. Rebuild Scope Options

### Option A: "Lite" Rebuild (Demo-Focused)

**Goal**: Minimal working demo for talk, ~500 lines of code

**Include**:
- Single-file entry point
- Git diff collection (50 lines)
- AI summary generation (100 lines)
- Standards module with 10 key patterns (200 lines)
- MCP server with one tool (100 lines)
- Basic OTel instrumentation

**Exclude**:
- Claude Code chat integration (complex JSONL parsing)
- Dialogue/technical sections (just summary)
- Reflection/context capture tools
- Token management/filtering
- Session grouping
- Narrative logging

**Telemetry Focus**:
- Demonstrate the builder pattern
- Show span nesting
- Show GenAI conventions
- Show how Weaver generates standards

**Pros**:
- Fast to build (1-2 days)
- Easy to understand in a talk
- Clear telemetry story

**Cons**:
- Loses the "real project" authenticity
- Can't show the depth of instrumentation
- Might feel contrived

### Option B: "Full" Rebuild (Production-Quality)

**Goal**: Modern rewrite with same functionality

**Include**:
- LangGraph orchestration
- All three AI sections
- Claude Code integration
- MCP server with both tools
- Full token management
- Weaver-generated standards

**Approach**:
1. Keep standards module philosophy, regenerate with Weaver
2. Rewrite collectors with cleaner async/await
3. Replace custom orchestration with LangGraph
4. Add OpenLLMetry for automatic AI tracing
5. Keep MCP server (still necessary)

**Pros**:
- Real production-quality code
- Demonstrates modern best practices
- More impressive demo

**Cons**:
- 2-3 weeks of work
- More complexity to explain
- Risk of scope creep

### Option C: "Hybrid" Rebuild (Recommended)

**Goal**: Rewrite core with modern tools, preserve telemetry philosophy

**Phase 1: Standards + Weaver** (Talk Demo)
- Extract standards module
- Convert to OpenTelemetry Weaver schema
- Generate TypeScript/JavaScript bindings
- Demo: "Here's how an agent reads these standards"

**Phase 2: Minimal Journal** (Working Demo)
- Single AI section (summary only)
- Git collection
- Basic MCP tool
- Full instrumentation using Weaver standards

**Phase 3: AI Instrumentation Agent** (The Wow Factor)
- Agent that reads Weaver schema
- Discovers conventions
- Instruments new code
- Validates via backend queries

**Essential for Demo**:
1. Standards module (shows conventions)
2. One working span with nested calls
3. GenAI attributes on AI call
4. MCP tool showing real-time capture
5. Agent instrumenting code live

**Nice-to-Have**:
- Full journal generation
- Claude Code integration
- All three sections
- Token management

### Recommendation for KubeCon EU 2026

**Go with Option C (Hybrid)** because:

1. **The talk is about the PROCESS**, not the final product
2. **Weaver integration** is the new innovation (vs existing codebase)
3. **Live agent demo** is the climax
4. **Simpler code** is easier to show in slides

**Suggested Demo Flow**:
1. "Here's a simple app" (minimal journal)
2. "Here's our standards module" (Weaver-generated)
3. "Here's what instrumentation looks like" (one function)
4. "Now watch the agent do it" (LIVE: agent instruments new code)
5. "Let's validate it worked" (query Datadog)

**Time Investment**:
- Weaver schema extraction: 1 day
- Minimal journal rewrite: 2 days
- Agent prompt engineering: 2 days
- Demo polishing: 2 days
- **Total: ~1 week**

---

## Appendix: Key Files Reference

| File | Lines | Purpose |
|------|-------|---------|
| `src/index.js` | 450 | CLI entry, orchestration |
| `src/telemetry/standards.js` | 1100 | THE telemetry standards |
| `src/integrators/context-integrator.js` | 500 | Context orchestration |
| `src/collectors/claude-collector.js` | 280 | JSONL parsing |
| `src/generators/journal-generator.js` | 150 | Section orchestration |
| `src/mcp/server.js` | 400 | MCP server |
| `src/managers/journal-manager.js` | 800 | File management |

**Total Source**: ~28,500 lines (excluding tests, docs)

---

## Appendix: The Thesis (From Whitney's Talk Abstract)

> "Her path to adding instrumentation likely mirrors that of many teams: an effort to follow OpenTelemetry semantic conventions, reinforced first through documentation, then later through a shared library of standards. Eventually, she built an AI agent that reads OpenTelemetry docs, discovers conventions, extends the standards module, instruments the code, and validates that it all works by querying the backend."

The codebase demonstrates this evolution:
1. **Documentation phase**: PRDs documenting conventions
2. **Standards library**: `src/telemetry/standards.js`
3. **Agent phase**: `.claude/skills/add-telemetry/`

The rebuild should trace this same arc, but with Weaver as the formalization layer that enables the agent to work across codebases.
