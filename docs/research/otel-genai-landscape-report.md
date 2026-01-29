# OpenTelemetry and GenAI Observability Landscape Report

**Prepared for:** Whitney Lee's KubeCon EU 2026 Talk
**Talk Title:** "When the Codebase Starts Instrumenting Itself"
**Date:** January 28, 2026

---

## Executive Summary

This report examines the current state of OpenTelemetry for GenAI observability to inform Whitney's talk about automated instrumentation. The landscape has evolved significantly, with GenAI semantic conventions now stabilizing (though still experimental), multiple auto-instrumentation options available, and strong support from observability vendors like Datadog. The key insight for the talk: the tooling now exists to enable AI agents to read conventions, generate compliant instrumentation, and validate it against observability backends.

---

## 1. OpenTelemetry GenAI Semantic Conventions

### Current Status: Development (Not Yet Stable)

The GenAI semantic conventions are actively developed under the OpenTelemetry Semantic Conventions SIG. As of late January 2026, they remain in **"Development"** status, meaning they are subject to change.

**Sources:**
- [Semantic conventions for generative AI systems | OpenTelemetry](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Releases - open-telemetry/semantic-conventions](https://github.com/open-telemetry/semantic-conventions/releases)

### What's Standardized

The GenAI conventions define signals across three areas:

**Spans (Client Operations):**
- Span naming: `{gen_ai.operation.name} {gen_ai.request.model}`
- Operation types: `chat`, `text_completion`, `embeddings`, `image_generation`

**Key Attributes:**
| Attribute | Description |
|-----------|-------------|
| `gen_ai.system` | Provider family (openai, anthropic, etc.) |
| `gen_ai.operation.name` | Operation type (chat, embeddings, etc.) |
| `gen_ai.request.model` | Model name requested |
| `gen_ai.response.model` | Model name returned |
| `gen_ai.usage.input_tokens` | Prompt token count |
| `gen_ai.usage.output_tokens` | Completion token count |
| `gen_ai.provider.name` | Provider identifier |
| `gen_ai.conversation.id` | Session/thread identifier |

**Agent-Specific Conventions:**
- `gen_ai.agent.id` - Unique agent identifier
- `gen_ai.agent.name` - Human-readable agent name
- `gen_ai.agent.description` - Agent description

**Metrics:**
- Token usage metrics
- Latency distributions
- Error rates by provider/model

**Sources:**
- [Gen AI Attributes Registry | OpenTelemetry](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/)
- [GenAI Spans | OpenTelemetry](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)

### Breaking Changes Since v1.36.0 (Whitney's Current Version: v1.37.0)

Whitney's commit-story codebase references v1.37.0 conventions. Here's what changed:

**v1.37.0 Major Changes:**
- **Chat history revamp**: Instead of per-message events (`gen_ai.user.message`, `gen_ai.assistant.message`, `gen_ai.tool.message`), the new model uses:
  - `gen_ai.system_instructions`
  - `gen_ai.input.messages`
  - `gen_ai.output.messages`
- These can appear on spans or the new `gen_ai.client.inference.operation.details` event

**Deprecations:**
- `gen_ai.system.message` event
- `gen_ai.user.message` event
- `gen_ai.assistant.message` event
- `gen_ai.tool.message` event

**Migration Path:**
Instrumentations should introduce `OTEL_SEMCONV_STABILITY_OPT_IN` environment variable with values:
- `gen_ai_latest_experimental` - emit latest version
- Default: continue emitting v1.36.0 conventions

**Source:** [GitHub Issue #3515 - traceloop/openllmetry](https://github.com/traceloop/openllmetry/issues/3515)

### Comparison to Whitney's Standards Module

Whitney's 866-line `standards.js` module already implements many of these conventions correctly:

| Convention Area | Whitney's Implementation | OTel Standard | Status |
|-----------------|-------------------------|---------------|--------|
| `gen_ai.request.model` | Yes | Yes | Aligned |
| `gen_ai.response.model` | Yes | Yes | Aligned |
| `gen_ai.usage.prompt_tokens` | Yes | Yes | Aligned |
| `gen_ai.usage.completion_tokens` | Yes | Yes | Aligned |
| `gen_ai.operation.name` | Yes ('chat') | Yes | Aligned |
| `gen_ai.provider.name` | Yes (auto-detected) | Yes | Aligned |
| `gen_ai.conversation.id` | Yes | Yes | Aligned |
| `gen_ai.request.temperature` | Yes | Yes | Aligned |
| `gen_ai.request.messages_count` | Extension | Not standard | Custom |
| `gen_ai.response.message_length` | Extension | Not standard | Custom |

**Whitney's Extensions (custom namespace):**
- `commit_story.*` namespace for application-specific attributes
- Extensive context, filtering, and journal operation attributes
- MCP-specific attributes using `rpc.*` semantic conventions

**What Whitney Should Consider:**
1. The new message event format (v1.37.0+) may require updates to event builders
2. Her current `gen_ai.content.prompt` and `gen_ai.content.completion` event attributes should migrate to the structured `gen_ai.input.messages` / `gen_ai.output.messages` format

---

## 2. OpenLLMetry (Traceloop)

### What It Is

OpenLLMetry is Traceloop's open-source extension to OpenTelemetry that provides auto-instrumentation specifically for LLM applications. It's built on OTel and extends it with LLM-specific conventions.

**Source:** [GitHub - traceloop/openllmetry](https://github.com/traceloop/openllmetry)

### Auto-Instrumentation Coverage

**Supported LLM Providers (Python):**
- OpenAI / Azure OpenAI
- **Anthropic** (relevant for commit-story)
- Cohere, Ollama, Mistral AI
- HuggingFace, AWS Bedrock, AWS SageMaker
- Google Vertex AI, Gemini
- Together AI, Groq, Replicate

**Supported Frameworks:**
- LangChain
- LlamaIndex
- Haystack

**Supported Vector Databases:**
- Pinecone
- Chroma
- Qdrant
- Weaviate

### How It Works

```python
# Python usage
from opentelemetry.instrumentation.anthropic import AnthropicInstrumentor
AnthropicInstrumentor().instrument()
```

By default, it logs prompts, completions, and embeddings to span attributes. This can be disabled with `TRACELOOP_TRACE_CONTENT=false` for privacy.

**Source:** [Observability for Anthropic with Traceloop](https://www.traceloop.com/openllmetry/integrations/observability-for-anthropic-with-traceloop)

### Could It Replace Manual Instrumentation in Commit-Story?

**Partial Yes, But...**

OpenLLMetry could auto-instrument the direct Anthropic API calls in commit-story, capturing:
- Model requests/responses
- Token usage
- Latency

**However, it cannot replace:**
- Whitney's application-specific `commit_story.*` namespace
- Context filtering telemetry
- Journal operation tracking
- Git data collection telemetry
- MCP server operation tracking

**Recommendation for the Talk:**
OpenLLMetry is a great "getting started" option for basic LLM observability. Whitney's standards module represents the *next level*: domain-specific conventions that encode business logic semantics. The progression (auto-instrument basics → formalize custom standards → automate instrumentation generation) is the narrative arc.

### JavaScript Support

OpenLLMetry-js exists but has less coverage than Python. For commit-story (Node.js), Whitney would need to evaluate current package maturity.

**Source:** [GitHub - traceloop/openllmetry-js](https://github.com/traceloop/openllmetry-js/issues/7)

---

## 3. Claude Code's Internal OpenTelemetry

### Native OTel Support: Yes!

Claude Code has built-in OpenTelemetry support that can be enabled via environment variables. This is opt-in telemetry for monitoring Claude Code usage itself.

**Source:** [Monitoring - Claude Code Docs](https://code.claude.com/docs/en/monitoring-usage)

### Configuration

```bash
# Enable telemetry
export CLAUDE_CODE_ENABLE_TELEMETRY=1

# Choose exporters
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp

# Configure endpoint
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

### What Telemetry Claude Code Exports

**Metrics (via OTel Metrics Protocol):**
| Metric | Description |
|--------|-------------|
| `claude_code.session.count` | CLI sessions started |
| `claude_code.lines_of_code.count` | Lines modified |
| `claude_code.pull_request.count` | PRs created |
| `claude_code.commit.count` | Commits created |
| `claude_code.cost.usage` | Session cost (USD) |
| `claude_code.token.usage` | Tokens used |
| `claude_code.code_edit_tool.decision` | Tool permission decisions |
| `claude_code.active_time.total` | Active time (seconds) |

**Events (via OTel Logs Protocol):**
| Event | Description |
|-------|-------------|
| `claude_code.user_prompt` | User submits a prompt |
| `claude_code.tool_result` | Tool execution completes |
| `claude_code.api_request` | API request to Claude |
| `claude_code.api_error` | API request fails |
| `claude_code.tool_decision` | Permission accept/reject |

**Standard Attributes on All Telemetry:**
- `session.id`
- `app.version`
- `organization.id`
- `user.account_uuid`
- `terminal.type`

### Privacy Controls

- Telemetry is opt-in
- User prompt content is redacted by default (only length recorded)
- To enable prompt logging: `OTEL_LOG_USER_PROMPTS=1`

### Can This Telemetry Be Harvested?

**Yes, with caveats:**

1. **Direct export**: Claude Code can export directly to any OTLP endpoint
2. **Via OTel Collector**: Standard OTel Collector pipeline
3. **To Datadog**: OTLP to Datadog Agent or direct to Datadog intake

**What's NOT Available:**
- Internal model reasoning traces
- Token-by-token generation telemetry
- Internal tool execution details beyond what's in `tool_result` events

### Demo Potential

Whitney could show Claude Code's own telemetry flowing into Datadog while Claude Code is instrumenting *other* code. Meta-observability: "The AI agent is observable while making code observable."

---

## 4. Datadog LLM Observability

### Native GenAI Semantic Convention Support

Datadog now natively supports OpenTelemetry GenAI Semantic Conventions (v1.37+). This means properly-instrumented OTel GenAI spans automatically light up LLM Observability features.

**Source:** [Datadog LLM Observability natively supports OpenTelemetry GenAI Semantic Conventions](https://www.datadoghq.com/blog/llm-otel-semantic-convention/)

### Automatic Attribute Mapping

Datadog maps GenAI attributes to its native LLM Observability schema:

| OTel Attribute | Datadog LLM Obs Feature |
|----------------|-------------------------|
| `gen_ai.request.model` | Model name |
| `gen_ai.usage.input_tokens` | Token usage tracking |
| `gen_ai.usage.output_tokens` | Token usage tracking |
| `gen_ai.provider.name` | Provider breakdown |
| `gen_ai.operation.name` | Operation type |

### Features That Light Up

**With Proper GenAI Telemetry:**

1. **Cost Tracking**
   - Automatic cost calculation from token counts
   - Breakdown by provider/model
   - Cost over time charts
   - Most expensive calls identification

2. **Token Usage Dashboard**
   - Input vs. output token breakdown
   - Token change over time
   - By model/provider analysis

3. **Latency Analysis**
   - Request duration tracking
   - P50/P95/P99 latency
   - Slow request identification

4. **Quality Evaluations** (automatic)
   - Hallucination detection
   - Prompt injection detection
   - Unsafe response detection
   - PII leak detection
   - Topic relevancy
   - Sentiment analysis

**Source:** [LLM Observability | Datadog](https://docs.datadoghq.com/llm_observability/)

### Integration Options

1. **Direct OTLP to Datadog intake endpoint**
2. **Via Datadog Agent** (OTLP ingest enabled)
3. **Via OTel Collector** (with Datadog exporter)
4. **Datadog Distribution of OTel Collector**

### Datadog MCP Server Connection

The Datadog MCP Server provides AI agents with access to:
- Logs, traces, incident context
- Metrics monitoring
- Monitor/SLO management
- Service definitions
- Team information

**For Whitney's Demo:**
An AI agent using the Datadog MCP server could:
1. Read existing telemetry patterns
2. Identify missing instrumentation
3. Generate compliant code
4. Verify instrumentation by querying the backend

**Source:** [Datadog MCP Server](https://docs.datadoghq.com/bits_ai/mcp_server/)

### What Makes a Compelling Demo

1. **Before/After**: Show sparse telemetry, then rich GenAI observability
2. **Cost correlation**: Connect code changes to cost impact
3. **Live evaluation**: Show automatic quality checks triggering
4. **Cross-layer correlation**: Link GenAI spans to underlying infrastructure

---

## 5. OpenTelemetry Weaver

### What Is OTel Weaver?

OpenTelemetry Weaver is the official CLI and automation platform for managing, validating, and evolving semantic conventions. It enables "observability by design" by treating telemetry as a schema.

**Source:** [GitHub - open-telemetry/weaver](https://github.com/open-telemetry/weaver)

### Core Capabilities

1. **Schema Definition**: Define telemetry schemas via semantic conventions
2. **Validation**: Lint syntax, semantics, and custom rules
3. **Code Generation**: Generate type-safe SDKs in multiple languages
4. **Documentation Generation**: Auto-generate Markdown docs from schemas
5. **Diff & Evolution**: Track schema changes, support upgrades/downgrades

### Current Version: v0.16.1 (Production-Ready)

Weaver is versioned as CLI v0.X but is production-ready with active releases.

**Source:** [Observability by Design: Unlocking Consistency with OpenTelemetry Weaver | OpenTelemetry](https://opentelemetry.io/blog/2025/otel-weaver/)

### Template System

Weaver uses MiniJinja (Jinja2-compatible) for code generation:

```yaml
# weaver.yaml config
templates:
  - pattern: semantic_attributes.j2
    filter: semconv_grouped_attributes(...)
    application_mode: each
```

**Supported Output:**
- Go code (primary example)
- Rust code
- Markdown documentation
- Extensible to other languages via templates

### Custom Registry Support

Teams can define their own registries that extend the official OTel conventions:

```yaml
# custom registry definition
name: commit_story
description: OTel signals for commit-story journal generation
semconv_version: 0.1.0
dependencies:
  - name: otel
    registry_path: https://github.com/open-telemetry/semantic-conventions/archive/refs/tags/v1.37.0.zip[model]
```

This allows Whitney to:
1. Define `commit_story.*` attributes formally
2. Import official GenAI conventions as dependencies
3. Generate type-safe code for both

**Source:** [Generating semantic convention libraries | OpenTelemetry](https://opentelemetry.io/docs/specs/semconv/non-normative/code-generation/)

### How an AI Agent Could Use Weaver

This is the key to Whitney's talk narrative. Here's the workflow:

**1. Read Conventions (Schema Discovery)**
```bash
weaver registry resolve --registry ./my-registry
```
An AI agent can parse the resolved registry YAML to understand available attributes, their types, and relationships.

**2. Discover What Attributes to Use**
The registry contains:
- Attribute definitions (name, type, description, examples)
- Span definitions (name patterns, required/optional attributes)
- Metric definitions

**3. Generate Instrumentation Code**
```bash
weaver registry generate --registry ./my-registry \
  --templates ./templates/javascript \
  --output ./src/telemetry
```
Weaver generates type-safe builder functions that prevent instrumentation errors.

**4. Validate Compliance**
```bash
weaver registry check --registry ./my-registry
```
Can be run in CI/CD to ensure telemetry changes don't violate conventions.

### Workflow for Whitney's Agent

1. **Agent reads Weaver registry** (YAML/JSON schemas)
2. **Agent identifies code locations** needing instrumentation
3. **Agent generates instrumentation** using Weaver-generated builders
4. **Agent validates** by querying the observability backend
5. **Loop**: Refine based on what's observable

**Example Registry Output:**
```yaml
groups:
  - id: gen_ai.client
    type: span
    brief: Describes GenAI client operations
    attributes:
      - ref: gen_ai.system
        requirement_level: required
      - ref: gen_ai.request.model
        requirement_level: required
      - ref: gen_ai.operation.name
        requirement_level: required
```

An AI agent can parse this and generate:
```javascript
const attrs = OTEL.attrs.genAI.request(
  model,      // gen_ai.request.model (required)
  temperature // gen_ai.request.temperature (optional)
);
```

### Resources

- [OpenTelemetry Weaver Examples](https://github.com/open-telemetry/opentelemetry-weaver-examples) - Official examples repo
- [Weaver Forge README](https://github.com/open-telemetry/weaver/blob/main/crates/weaver_forge/README.md) - Template system docs

---

## 6. How This All Connects (Story Arc)

### The Narrative for Whitney's Talk

**Act 1: Manual Instrumentation (Where Everyone Starts)**
- Hardcoded strings, inconsistent naming
- Easy to make mistakes, hard to maintain
- "I started with OTel semantic conventions documentation..."

**Act 2: Standards Formalization (What Whitney Built)**
- The 866-line `standards.js` module
- Builder patterns prevent errors
- Dual emission (spans + metrics)
- Domain-specific conventions (`commit_story.*`)
- "I created a standards module that encodes conventions..."

**Act 3: Automation (The Vision)**
- OTel Weaver formalizes the standards into machine-readable schemas
- AI agent reads schemas, discovers conventions
- Agent generates compliant instrumentation
- Agent validates by querying observability backend
- "Now the codebase instruments itself..."

### The Demo Flow

1. **Show Weaver registry** defining commit-story conventions
2. **Show AI agent** parsing the registry
3. **Show generated instrumentation** appearing in code
4. **Show telemetry flowing** into Datadog LLM Observability
5. **Show the feedback loop**: Agent queries Datadog, refines instrumentation

### Gaps and Unknowns

**Known Gaps:**
1. **Weaver doesn't generate JavaScript yet**: Whitney may need to create templates or use Go as the example
2. **GenAI conventions still experimental**: Breaking changes possible before the talk
3. **OpenLLMetry doesn't work with Claude Agent SDK**: IPC/WebSocket communication bypasses HTTP instrumentation

**Unknowns:**
1. **Weaver multi-registry stability**: Custom registry support is "basic" currently
2. **AI agent reliability**: Generating correct instrumentation consistently
3. **Demo failure modes**: What if the agent generates bad telemetry?

### What Makes the Demo Compelling

1. **Live coding feel**: Agent modifies code in real-time
2. **Observable results**: Datadog dashboards update immediately
3. **Full loop closure**: Agent uses Datadog MCP to verify its own work
4. **Meta-recursion**: Claude Code is observable while making code observable

### Recommendations for Whitney

1. **Formalize standards as Weaver registry first** - This is the foundation
2. **Create JavaScript templates for Weaver** - Or use TypeScript/Go as example
3. **Build the "Telemetry Agent" incrementally**:
   - Phase 1: Read registry, understand conventions
   - Phase 2: Identify uninstrumented code
   - Phase 3: Generate instrumentation
   - Phase 4: Validate via Datadog API
4. **Have fallback demo paths** - If live generation fails, show pre-recorded or step-by-step
5. **Emphasize the "why"** - Not just that automation is cool, but that it enables consistency at scale

---

## Quick Reference: Key Links

### OpenTelemetry GenAI Conventions
- [Overview](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Span Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/)
- [Metrics](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-metrics/)
- [Attribute Registry](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/)
- [Releases/Changelog](https://github.com/open-telemetry/semantic-conventions/releases)

### OpenLLMetry
- [GitHub](https://github.com/traceloop/openllmetry)
- [Anthropic Instrumentation](https://www.traceloop.com/openllmetry/integrations/observability-for-anthropic-with-traceloop)

### Claude Code Telemetry
- [Monitoring Docs](https://code.claude.com/docs/en/monitoring-usage)

### Datadog LLM Observability
- [Product Page](https://www.datadoghq.com/product/llm-observability/)
- [OTel GenAI Support Announcement](https://www.datadoghq.com/blog/llm-otel-semantic-convention/)
- [OTel Instrumentation Docs](https://docs.datadoghq.com/llm_observability/instrumentation/otel_instrumentation/)
- [MCP Server Docs](https://docs.datadoghq.com/bits_ai/mcp_server/)

### OpenTelemetry Weaver
- [GitHub](https://github.com/open-telemetry/weaver)
- [Official Blog Post](https://opentelemetry.io/blog/2025/otel-weaver/)
- [Code Generation Guide](https://opentelemetry.io/docs/specs/semconv/non-normative/code-generation/)
- [Examples Repository](https://github.com/open-telemetry/opentelemetry-weaver-examples)

---

*Report generated January 28, 2026*
