/**
 * Journal Graph - LangGraph StateGraph for journal generation
 *
 * Orchestrates AI generation of journal sections:
 * - Summary: Narrative overview of the commit
 * - Dialogue: Key quotes from human/assistant conversation
 * - Technical Decisions: Architecture and implementation decisions
 *
 * Graph structure:
 * START → [summary, technical] (parallel) → dialogue → END
 */

import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import { ChatAnthropic } from '@langchain/anthropic';

/**
 * Journal state definition using LangGraph Annotation API
 * Errors use a reducer to accumulate from parallel nodes
 */
export const JournalState = Annotation.Root({
  // Input
  context: Annotation(),

  // Outputs (populated by nodes)
  summary: Annotation(),
  dialogue: Annotation(),
  technicalDecisions: Annotation(),

  // Metadata
  errors: Annotation({
    reducer: (left, right) => [...(left || []), ...(right || [])],
    default: () => [],
  }),
});

/**
 * Lazy-initialized model instance
 * Uses Claude Haiku 4.5 for cost-effective generation
 */
let model;

/**
 * Get or create the Claude model instance
 * @returns {ChatAnthropic} Model instance
 */
export function getModel() {
  if (!model) {
    model = new ChatAnthropic({
      model: 'claude-3-5-haiku-latest',
      maxTokens: 2048,
      temperature: 0,
    });
  }
  return model;
}

/**
 * Reset model instance (for testing)
 */
export function resetModel() {
  model = null;
}

/**
 * Summary generation node
 * Creates a narrative overview of the commit
 */
async function summaryNode(state) {
  try {
    const { context } = state;

    const prompt = `You have been given development context for a git commit.

Step 1: Analyze the git diff to understand what changed
Step 2: Review the chat messages for WHY these changes were made
Step 3: Identify the key narrative arc (problem → solution)
Step 4: Write a 2-3 sentence summary focusing on the "why"

## Commit Information
**Hash**: ${context.commit.shortHash}
**Author**: ${context.commit.author}
**Message**: ${context.commit.message}

## Code Changes
\`\`\`diff
${context.commit.diff || 'No diff available'}
\`\`\`

## Development Conversation
${formatChatMessages(context.chat.messages)}

Write your summary (2-3 sentences, focus on the "why"):`;

    const result = await getModel().invoke([{ role: 'user', content: prompt }]);

    return { summary: result.content };
  } catch (error) {
    return {
      summary: '[Summary generation failed]',
      errors: [`Summary generation failed: ${error.message}`],
    };
  }
}

/**
 * Technical decisions extraction node
 * Identifies architecture and implementation decisions
 */
async function technicalNode(state) {
  try {
    const { context } = state;

    const prompt = `You have been given development context including code changes and discussion.

Step 1: Identify decisions about architecture, libraries, or approaches
Step 2: Note whether each was made, discussed, or deferred
Step 3: Include brief rationale when available
Step 4: Format as bullet points with decision status

## Commit Information
**Hash**: ${context.commit.shortHash}
**Message**: ${context.commit.message}

## Code Changes
\`\`\`diff
${context.commit.diff || 'No diff available'}
\`\`\`

## Development Conversation
${formatChatMessages(context.chat.messages)}

Extract technical decisions (bullet points with status - Made/Discussed/Deferred):`;

    const result = await getModel().invoke([{ role: 'user', content: prompt }]);

    return { technicalDecisions: result.content };
  } catch (error) {
    return {
      technicalDecisions: '[Technical decisions extraction failed]',
      errors: [`Technical decisions extraction failed: ${error.message}`],
    };
  }
}

/**
 * Dialogue extraction node
 * Extracts key quotes from human/assistant conversation
 * Runs after summary to avoid redundancy
 */
async function dialogueNode(state) {
  try {
    const { context, summary } = state;

    const prompt = `You have been given chat messages from a development session.

The summary of this work is: ${summary}

Step 1: Identify messages where the human explains their thinking
Step 2: Select 2-4 quotes that reveal intent, decisions, or insights
Step 3: Ensure quotes don't repeat what's in the summary
Step 4: Format as "Human:" followed by the quote

## Development Conversation
${formatChatMessages(context.chat.messages)}

Extract the dialogue (2-4 quotes, format as "Human: [quote]"):`;

    const result = await getModel().invoke([{ role: 'user', content: prompt }]);

    return { dialogue: result.content };
  } catch (error) {
    return {
      dialogue: '[Dialogue extraction failed]',
      errors: [`Dialogue extraction failed: ${error.message}`],
    };
  }
}

/**
 * Format chat messages for prompt inclusion
 * @param {object[]} messages - Filtered chat messages
 * @returns {string} Formatted messages
 */
function formatChatMessages(messages) {
  if (!messages || messages.length === 0) {
    return '*No conversation captured for this time window*';
  }

  return messages
    .map((msg) => {
      const role = msg.type === 'user' ? '**Human**' : '**Assistant**';
      const time = new Date(msg.timestamp).toLocaleTimeString();
      return `${role} (${time}):\n${msg.content}`;
    })
    .join('\n\n');
}

/**
 * Build and compile the journal generation graph
 * @returns {CompiledStateGraph} Compiled graph ready for execution
 */
function buildGraph() {
  // Node names use "generate_" prefix to avoid conflict with state attribute names
  const graph = new StateGraph(JournalState)
    .addNode('generate_summary', summaryNode)
    .addNode('generate_technical', technicalNode)
    .addNode('generate_dialogue', dialogueNode)
    // Parallel execution: summary and technical run simultaneously
    .addEdge(START, 'generate_summary')
    .addEdge(START, 'generate_technical')
    // Dialogue waits for both summary and technical to complete
    .addEdge('generate_summary', 'generate_dialogue')
    .addEdge('generate_technical', 'generate_dialogue')
    // End after dialogue
    .addEdge('generate_dialogue', END);

  return graph.compile();
}

// Compiled graph instance
let compiledGraph;

/**
 * Get or create the compiled graph
 * @returns {CompiledStateGraph} Compiled graph
 */
function getGraph() {
  if (!compiledGraph) {
    compiledGraph = buildGraph();
  }
  return compiledGraph;
}

/**
 * Generate all journal sections from context
 * @param {Context} context - Gathered context from integrator
 * @returns {Promise<JournalSections>} Generated journal sections
 */
export async function generateJournalSections(context) {
  const graph = getGraph();

  const result = await graph.invoke({ context });

  return {
    summary: result.summary || '',
    dialogue: result.dialogue || '',
    technicalDecisions: result.technicalDecisions || '',
    errors: result.errors || [],
    generatedAt: new Date(),
  };
}

// Export node functions for testing
export { summaryNode, technicalNode, dialogueNode, formatChatMessages, buildGraph };
