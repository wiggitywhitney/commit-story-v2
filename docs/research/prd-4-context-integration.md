# PRD #4 Research: Context Integration & Filtering

**Date**: 2026-01-29
**Status**: Complete
**Purpose**: Research token counting, context window sizes, and sensitive data detection approaches

## Summary

This document covers research findings for implementing context integration and filtering for commit-story v2.

## Claude Context Window Sizes

Sources: [Context windows - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/context-windows), [Anthropic Claude Haiku 4.5 Analysis](https://www.datastudios.org/post/anthropic-claude-haiku-4-5-how-the-200k-context-window-and-64k-output-limit-shape-long-form-work-d)

### Claude Haiku 4.5 (Our Target Model)

| Aspect | Value |
|--------|-------|
| Context Window | 200,000 tokens |
| Output Limit | 64,000 tokens |
| Input Cost | $1 per million tokens |
| Output Cost | $5 per million tokens |

### Key Considerations

- **Unified buffer**: System messages, user messages, assistant replies, tool calls, and image tokens ALL count toward the 200k total
- **Context awareness**: Haiku 4.5 can track remaining token budget throughout conversation
- **1M context**: Only available for Sonnet 4 and Sonnet 4.5, NOT Haiku

### Budget Recommendation for Journal Generation

For journal generation, recommend reserving:
- **Input budget**: ~150,000 tokens (leaving room for output and overhead)
- **Output budget**: ~8,000-16,000 tokens (typical journal entry size)

This gives us ~150k tokens for: git diff + commit message + filtered chat messages.

## Token Counting Approaches

Sources: [Token Counting - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/token-counting), [Anthropic Tokenizer TypeScript](https://github.com/anthropics/anthropic-tokenizer-typescript)

### Options Evaluated

| Approach | Accuracy | Speed | Dependencies | Recommended |
|----------|----------|-------|--------------|-------------|
| Anthropic API `countTokens` | Exact | Slow (API call) | @anthropic-ai/sdk | For billing validation |
| @anthropic-ai/tokenizer | ~90% (pre-Claude 3) | Fast | tiktoken | Deprecated for Claude 3+ |
| Character-based heuristic | ~80% | Instant | None | For budget estimation |
| js-tiktoken p50k_base | ~85% | Fast | js-tiktoken | Good offline estimate |

### Recommendation: Character-Based Heuristic

For our use case (budget estimation, not billing), a simple character-based heuristic is sufficient:

```javascript
/**
 * Estimate token count using character-based heuristic
 * Claude uses ~4 characters per token on average
 * This is intentionally conservative (overestimates)
 */
function estimateTokens(text) {
  if (!text) return 0;
  // Use 3.5 chars/token to be slightly conservative
  return Math.ceil(text.length / 3.5);
}
```

**Rationale**:
- No external dependencies (lean packaging requirement)
- Fast enough for real-time use
- Conservative estimate prevents overflow
- Exact token count not needed for journal generation
- Can always use API count if precision needed later

## Sensitive Data Detection

Sources: [@redactpii/node - npm](https://www.npmjs.com/package/@redactpii/node), [solvvy/redact-pii GitHub](https://github.com/solvvy/redact-pii)

### Libraries Evaluated

| Library | Status | Dependencies | Performance |
|---------|--------|--------------|-------------|
| redact-pii | **DEPRECATED** | 2 deps (includes Google DLP) | N/A |
| @redactpii/node | Active | **Zero deps** | <1ms |
| @agiledigital/pino-redact-pii | Active | Multiple | For logging |

### Recommendation: Custom Regex Patterns

Given our lean packaging requirement, implement custom regex patterns rather than adding a dependency.

**Patterns to Implement** (from PRD + common patterns):

```javascript
const SENSITIVE_PATTERNS = [
  // API Keys (generic)
  {
    pattern: /(?:api[_-]?key|apikey|api_secret)['":\s]*['""]?([a-zA-Z0-9_-]{20,})['""]?/gi,
    name: 'API Key'
  },

  // AWS Access Keys
  {
    pattern: /AKIA[0-9A-Z]{16}/g,
    name: 'AWS Access Key'
  },

  // AWS Secret Keys (40 char base64)
  {
    pattern: /(?:aws_secret|secret_access_key)['":\s]*['""]?([A-Za-z0-9/+=]{40})['""]?/gi,
    name: 'AWS Secret Key'
  },

  // JWT Tokens
  {
    pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,
    name: 'JWT Token'
  },

  // Generic Secrets
  {
    pattern: /(?:password|secret|token|credential)['":\s]*['""]?([^\s'"]{8,})['""]?/gi,
    name: 'Generic Secret'
  },

  // Private Keys
  {
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g,
    name: 'Private Key'
  },

  // GitHub Tokens
  {
    pattern: /gh[pousr]_[A-Za-z0-9_]{36,}/g,
    name: 'GitHub Token'
  },

  // Anthropic API Keys
  {
    pattern: /sk-ant-[a-zA-Z0-9-]{90,}/g,
    name: 'Anthropic API Key'
  },

  // OpenAI API Keys
  {
    pattern: /sk-[a-zA-Z0-9]{48,}/g,
    name: 'OpenAI API Key'
  }
];
```

**Email Pattern** (optional, configurable):
```javascript
// Only enable if user opts in - emails often intentional in chat
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
```

## Message Filtering Strategy

Based on v1 learnings and PRD-18 DD-014:

### Filter Rules

```javascript
const shouldFilterMessage = (message) => {
  // Skip non-conversation records (already filtered by collector)
  if (!message.type || !['user', 'assistant'].includes(message.type)) {
    return true;
  }

  // Filter meta messages
  if (message.isMeta === true) {
    return true;
  }

  // Get content
  const content = message.message?.content;

  // Filter empty content
  if (!content) {
    return true;
  }

  // If content is array, check for tool_use/tool_result
  if (Array.isArray(content)) {
    const hasToolUse = content.some(c => c.type === 'tool_use');
    const hasToolResult = content.some(c => c.type === 'tool_result');

    // EXCEPTION: Preserve journal_capture_context tool calls (DD-014)
    if (hasToolUse) {
      const isContextCapture = content.some(c =>
        c.type === 'tool_use' &&
        c.name === 'journal_capture_context'
      );
      if (!isContextCapture) {
        return true;
      }
    }

    if (hasToolResult) {
      return true;
    }

    // Check if there's any text content
    const hasText = content.some(c => c.type === 'text' && c.text?.trim());
    if (!hasText) {
      return true;
    }
  }

  // If content is string, check if empty
  if (typeof content === 'string' && !content.trim()) {
    return true;
  }

  return false; // Keep this message
};
```

## Token Budget Strategy

Per PRD DD-003: "Truncate diffs first, then older messages"

### Implementation Approach

```javascript
const applyTokenBudget = (context, budget = 150000) => {
  let currentTokens = 0;

  // 1. Always include commit metadata (small, ~500 tokens)
  currentTokens += estimateTokens(JSON.stringify(context.commit));

  // 2. Include chat messages (most recent first)
  const chatTokens = estimateTokens(formatMessages(context.chat.messages));
  currentTokens += chatTokens;

  // 3. Include diff if room remains
  const diffTokens = estimateTokens(context.commit.diff);

  if (currentTokens + diffTokens <= budget) {
    // Full diff fits
    return context;
  }

  // Need to truncate diff
  const remainingBudget = budget - currentTokens;
  const truncatedDiff = truncateDiff(context.commit.diff, remainingBudget);

  return {
    ...context,
    commit: {
      ...context.commit,
      diff: truncatedDiff,
      diffTruncated: true
    }
  };
};
```

## Implementation Recommendations

### Dependencies Decision

**Add NO new dependencies** for this PRD:
- Token counting: Character-based heuristic
- Sensitive data: Custom regex patterns
- Keep package lean per CLAUDE.md requirements

### File Structure

```text
src/integrators/
├── context-integrator.js      # Main orchestration
└── filters/
    ├── message-filter.js      # Filter noisy messages
    ├── token-filter.js        # Apply token budget
    └── sensitive-filter.js    # Redact sensitive data
```

### Error Handling

- If git collector fails: Return partial context with error flag
- If claude collector fails: Return git-only context
- If filtering fails: Log warning, return unfiltered
- Never let filtering errors crash journal generation

## Conclusion

Key decisions:
1. **Token counting**: Character-based heuristic (~3.5 chars/token)
2. **Sensitive data**: Custom regex patterns (no dependencies)
3. **Message filtering**: Filter tool calls except `journal_capture_context`
4. **Token budget**: 150k tokens, truncate diffs first, then older messages
5. **No new dependencies**: Keeps package lean
