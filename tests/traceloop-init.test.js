// ABOUTME: Tests for traceloop auto-instrumentation initialization (src/traceloop-init.js)
// ABOUTME: Runs the real LangChain instrumentation and verifies it activates only when COMMIT_STORY_TRACELOOP=true

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LangChainInstrumentation } from '@traceloop/instrumentation-langchain';
import { McpInstrumentation } from '@traceloop/instrumentation-mcp';
import * as callbackManagerModule from '@langchain/core/callbacks/manager';

let langChainSpy;
let mcpSpy;

beforeEach(() => {
  langChainSpy = vi.spyOn(LangChainInstrumentation.prototype, 'manuallyInstrument');
  mcpSpy = vi.spyOn(McpInstrumentation.prototype, 'manuallyInstrument');
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.COMMIT_STORY_TRACELOOP;
});

describe('traceloop-init', () => {
  it('activates LangChain instrumentation with the callback manager module when COMMIT_STORY_TRACELOOP is true', async () => {
    process.env.COMMIT_STORY_TRACELOOP = 'true';
    await import('../src/traceloop-init.js');
    expect(langChainSpy).toHaveBeenCalledTimes(1);
    const [arg] = langChainSpy.mock.calls[0];
    expect(arg.callbackManagerModule.CallbackManager).toBe(callbackManagerModule.CallbackManager);
  });

  it('does not activate MCP instrumentation, because the CLI never uses the MCP SDK', async () => {
    process.env.COMMIT_STORY_TRACELOOP = 'true';
    await import('../src/traceloop-init.js');
    expect(mcpSpy).not.toHaveBeenCalled();
  });

  it('does not activate instrumentation when COMMIT_STORY_TRACELOOP is unset', async () => {
    await import('../src/traceloop-init.js');
    expect(langChainSpy).not.toHaveBeenCalled();
  });

  it('does not activate instrumentation when COMMIT_STORY_TRACELOOP is false', async () => {
    process.env.COMMIT_STORY_TRACELOOP = 'false';
    await import('../src/traceloop-init.js');
    expect(langChainSpy).not.toHaveBeenCalled();
  });
});
