export class ErrorHandler {
  handleValidationError(error: string): Record<string, unknown> {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'VALIDATION_ERROR',
            message: error,
            timestamp: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }

  handleRateLimitError(): Record<string, unknown> {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            timestamp: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }

  handleToolError(error: unknown): Record<string, unknown> {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'TOOL_ERROR',
            message,
            timestamp: new Date().toISOString(),
          }, null, 2),
        },
      ],
    };
  }
}
