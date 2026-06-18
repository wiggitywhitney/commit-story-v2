// ABOUTME: Shared pino logger — structured JSON output to stdout for the main CLI
// ABOUTME: The MCP server uses its own stderr-destination logger (stdout is reserved for JSON-RPC)
import pino from 'pino';

export default pino({ level: 'info' });
