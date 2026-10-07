// ABOUTME: Conditionally initializes traceloop auto-instrumentation for LangChain
// ABOUTME: Gated by COMMIT_STORY_TRACELOOP=true — must be imported inside index.js, not via --import

if (process.env.COMMIT_STORY_TRACELOOP === 'true') {
  const { LangChainInstrumentation } = await import('@traceloop/instrumentation-langchain');
  const callbackManagerModule = await import('@langchain/core/callbacks/manager');

  new LangChainInstrumentation().manuallyInstrument({ callbackManagerModule });
}
