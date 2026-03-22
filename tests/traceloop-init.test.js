// ABOUTME: Tests for traceloop auto-instrumentation initialization (src/traceloop-init.js)
// ABOUTME: Verifies LangChain and MCP instrumentations register when COMMIT_STORY_TRACELOOP=true

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockLangChainRegister = vi.fn();
const mockMcpRegister = vi.fn();

vi.mock('@traceloop/instrumentation-langchain', () => ({
  LangChainInstrumentation: class MockLangChainInstrumentation {
    manuallyInstrument() { mockLangChainRegister(); }
  },
}));

vi.mock('@traceloop/instrumentation-mcp', () => ({
  McpInstrumentation: class MockMcpInstrumentation {
    manuallyInstrument() { mockMcpRegister(); }
  },
}));

beforeEach(() => {
  mockLangChainRegister.mockClear();
  mockMcpRegister.mockClear();
  vi.resetModules();
});

describe('traceloop-init', () => {
  it('registers LangChain instrumentation when COMMIT_STORY_TRACELOOP is true', async () => {
    process.env.COMMIT_STORY_TRACELOOP = 'true';
    await import('../src/traceloop-init.js');
    expect(mockLangChainRegister).toHaveBeenCalled();
    delete process.env.COMMIT_STORY_TRACELOOP;
  });

  it('registers MCP instrumentation when COMMIT_STORY_TRACELOOP is true', async () => {
    process.env.COMMIT_STORY_TRACELOOP = 'true';
    await import('../src/traceloop-init.js');
    expect(mockMcpRegister).toHaveBeenCalled();
    delete process.env.COMMIT_STORY_TRACELOOP;
  });

  it('does not register instrumentations when COMMIT_STORY_TRACELOOP is unset', async () => {
    delete process.env.COMMIT_STORY_TRACELOOP;
    await import('../src/traceloop-init.js');
    expect(mockLangChainRegister).not.toHaveBeenCalled();
    expect(mockMcpRegister).not.toHaveBeenCalled();
  });

  it('does not register instrumentations when COMMIT_STORY_TRACELOOP is false', async () => {
    process.env.COMMIT_STORY_TRACELOOP = 'false';
    await import('../src/traceloop-init.js');
    expect(mockLangChainRegister).not.toHaveBeenCalled();
    expect(mockMcpRegister).not.toHaveBeenCalled();
    delete process.env.COMMIT_STORY_TRACELOOP;
  });
});
