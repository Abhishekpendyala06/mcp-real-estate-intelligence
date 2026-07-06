#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Logger } from './utils/logger.js';
import { loadEnv } from './config/env.js';
import { registerTools } from './tools/index.js';
import { RateLimiter } from './middleware/rate-limiter.js';
import { ErrorHandler } from './middleware/error-handler.js';

loadEnv();
const logger = Logger.getInstance();
const rateLimiter = new RateLimiter();
const errorHandler = new ErrorHandler();

class RealEstateIntelligenceServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-real-estate-intelligence',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.info('Listing available tools');
      return { tools: registerTools() };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const clientId = 'client-123';
        if (!rateLimiter.checkLimit(clientId)) {
          return errorHandler.handleRateLimitError();
        }

        logger.info(`Calling tool: ${request.name}`);
        const result = await this.executeTool(request.name, request.arguments || {});

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error('Tool execution failed');
        return errorHandler.handleToolError(error);
      }
    });
  }

  private async executeTool(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return {
      tool: toolName,
      status: 'success',
      message: `Tool ${toolName} executed successfully`,
      timestamp: new Date().toISOString(),
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('MCP Real Estate Intelligence Server started');
  }
}

(async () => {
  try {
    const server = new RealEstateIntelligenceServer();
    await server.start();
  } catch (error) {
    logger.error('Failed to start server');
    process.exit(1);
  }
})().catch(() => {
  process.exit(1);
});
