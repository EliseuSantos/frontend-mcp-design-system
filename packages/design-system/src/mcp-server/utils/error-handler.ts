/**
 * Error handling utilities for MCP
 */

export function errorToMCPContent(error: unknown): {
  content: Array<{ type: 'text'; text: string }>;
  isError: boolean;
} {
  const message = error instanceof Error ? error.message : String(error);
  
  return {
    content: [
      {
        type: 'text' as const,
        text: `Error: ${message}`,
      },
    ],
    isError: true,
  };
}

