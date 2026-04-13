# Commit Story

**Your Engineering Journey, Remembered**

## What is Commit Story?

Commit Story transforms your git commits into rich journal entries by combining:

- **Your actual code changes** — the diff, the commit message, what you built
- **Conversations with your AI coding assistant** — the back-and-forth that led to decisions
- **The technical decisions and trade-offs you made** — captured automatically, not manually documented

Every time you commit, Commit Story generates a journal entry that tells the story of what you worked on and why. No workflow interruption, no manual documentation — just commit like you always do, and your engineering journal writes itself.

## Why Use It?

### For Yourself

- **Remember why** you made certain choices and how you overcame obstacles
- **See your growth** as a developer, not just a list of commits
- **Boost learning through reflection** — research shows [15 minutes of daily reflection improves performance by 20-25%](https://larryferlazzo.edublogs.org/files/2013/08/reflection-1di0i76.pdf)

### For Your Career

- **Evidence for performance reviews** and career advancement
- **Material for conference talks** and blog posts
- **Your engineering narrative**, documented as it happens

### For Your Team

- **Onboard new developers** with the actual story behind decisions
- **Meaningful retrospectives** with concrete examples
- **Preserve institutional knowledge** that usually gets lost

## Sample Journal Entry

Here's what a real journal entry looks like (from this repo):

```text
## 9:07:02 AM CST - Commit: 79a6c5a

### Summary
The developer implemented a new context formatting approach to improve journal entry
summaries in the commit-story system. They created a `formatContextForSummary()`
function in the journal-graph.js file that filters out AI assistant messages and
uses JSON.stringify to clearly present development session data.

The primary goal was to fix issues with summary generation, particularly preventing
the AI from echoing its own responses or including unnecessary process talk.

### Development Dialogue
> **Human:** "I would love to delete the February 3rd journal file in the Cluster
> Whisperer repo. And then recreate an entry for every commit, from today's oldest
> and newest. And then evaluate the full journal file."
> **Assistant:** "Great idea - that will give us a clean test of the fixes."

> **Human:** "Can we think of another way to do this besides prompt sprawl and
> harsh language? Would changing the role help? What's a more systematic way to
> solve this?"

### Technical Decisions
**DECISION: Implement V1-Style Context Formatting for Summaries** (Implemented)
  - V2 implementation was echoing AI responses in summaries
  - V1 used JSON-formatted context with self-documenting descriptions
  - Created formatContextForSummary() to filter out assistant messages
  - Used JSON.stringify to present context as clear DATA, not conversation

### Commit Details
- **Hash**: 79a6c5af84c0fc2e9b372271123358aec658c0c7
- **Author**: Whitney Lee
```

## Summaries

Commit Story can consolidate your per-commit journal entries into daily, weekly, and monthly summaries — the level most useful for standups, retrospectives, and personal reflection.

### How It Works

- **Daily summaries** read all journal entries for a given day and produce a standup-style narrative with sections for what was accomplished, key decisions, and open threads.
- **Weekly summaries** consolidate daily summaries into a week-in-review with highlights and recurring patterns.
- **Monthly summaries** consolidate weekly summaries into a retrospective with accomplishments, growth, and a look ahead.

### Automatic Generation

Summaries generate automatically on each commit:

1. On the first commit of a new day, daily summaries are generated for all unsummarized previous days
2. On the first commit after a week boundary, a weekly summary is generated
3. On the first commit of a new month, a monthly summary is generated

To disable automatic summaries:

```bash
export COMMIT_STORY_AUTO_SUMMARIZE=false
```

### Manual Generation

Generate summaries on demand with the `summarize` subcommand:

```bash
# Daily summaries
npx commit-story summarize 2026-02-22                     # Single day
npx commit-story summarize 2026-02-01..2026-02-20         # Date range
npx commit-story summarize 2026-02-22 --force             # Regenerate existing

# Weekly summaries
npx commit-story summarize --weekly 2026-W08              # Single week
npx commit-story summarize --weekly 2026-W08 --force      # Regenerate existing

# Monthly summaries
npx commit-story summarize --monthly 2026-02              # Single month
npx commit-story summarize --monthly 2026-02 --force      # Regenerate existing
```

### Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `COMMIT_STORY_AUTO_SUMMARIZE` | Set to `false` to disable automatic summary generation | `true` (enabled) |
| `COMMIT_STORY_TIMEZONE` | IANA timezone for day/week/month boundaries (e.g., `America/Chicago`) | System local time |
| `ANTHROPIC_API_KEY` | Required for all AI generation | — |

### Summary File Structure

Summaries are stored alongside your journal entries:

```text
journal/
├── entries/              # Per-commit entries (existing)
│   └── YYYY-MM/
│       └── YYYY-MM-DD.md
└── summaries/            # Consolidated summaries
    ├── daily/
    │   └── YYYY-MM-DD.md
    ├── weekly/
    │   └── YYYY-Www.md   # ISO week (e.g., 2026-W08)
    └── monthly/
        └── YYYY-MM.md
```

Duplicate detection uses file existence — if a summary file already exists, it is skipped unless `--force` is passed.

## v2 Architecture

This is a complete rebuild of [commit-story v1](https://github.com/wiggitywhitney/commit-story) with modern tooling:

| Component | v1 | v2 |
|-----------|----|----|
| AI Orchestration | Custom pipeline | **LangGraph** |
| LLM Provider | OpenAI | **Anthropic (Claude)** |
| Telemetry Schema | None | **OpenTelemetry Weaver** |

### Why the Rebuild?

v2 serves as a laboratory for exploring how AI automation reshapes telemetry practices. The codebase intentionally ships with **zero telemetry** — it's the "before" state for an AI instrumentation agent that will read OpenTelemetry conventions and instrument the code itself.

## Telemetry Schema

The `telemetry/registry/` directory contains an OpenTelemetry Weaver schema defining semantic conventions for commit-story. **No telemetry is implemented yet** — the schema exists so an AI agent can read it and instrument the codebase.

The schema:

- Imports official OTel semantic conventions (GenAI, VCS, RPC)
- Defines custom `commit_story.*` attributes for domain-specific telemetry

See [`docs/telemetry/`](docs/telemetry/) for the generated attribute documentation.

### Deployer SDK Setup

`commit-story` ships with `@opentelemetry/api` as a peer dependency — a lightweight no-op (~50KB) that does nothing unless an OTel SDK is present. No SDK is bundled in the package; deployers who want trace data bring their own.

An example bootstrap is available at [`examples/instrumentation.js`](examples/instrumentation.js) in the repository. Load it via `node --import` before the application:

```bash
node --import ./examples/instrumentation.js src/index.js
```

The example configures OTLP HTTP export, a `SimpleSpanProcessor` (suitable for CLI apps where the process may exit before a batch processor flushes), and graceful shutdown on `SIGTERM`/`SIGINT`/`process.exit()`.

## Project Status

### What's Built

- Git post-commit hook trigger
- Git diff and commit data collection
- Claude Code chat history collection and filtering
- AI-powered journal generation (summary, dialogue, technical decisions)
- Journal file management (`journal/entries/YYYY-MM/YYYY-MM-DD.md`)
- Daily, weekly, and monthly summary generation (automatic and manual)
- MCP server for real-time context capture
- OpenTelemetry Weaver telemetry schema

### What's Next

- [ ] CI/CD pipeline (PRD #23)
- [ ] Telemetry Agent — AI that reads the Weaver schema and instruments this codebase
- [ ] npm package distribution

## License

AGPL-3.0
