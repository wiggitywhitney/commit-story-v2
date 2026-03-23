// ABOUTME: Conditionally initializes traceloop auto-instrumentation for LangChain and MCP
// ABOUTME: Gated by COMMIT_STORY_TRACELOOP=true — must be imported inside index.js, not via --import

if (process.env.COMMIT_STORY_TRACELOOP === 'true') {
  const { LangChainInstrumentation } = await import('@traceloop/instrumentation-langchain');
  const { McpInstrumentation } = await import('@traceloop/instrumentation-mcp');

  new LangChainInstrumentation().manuallyInstrument();
  new McpInstrumentation().manuallyInstrument();
}
