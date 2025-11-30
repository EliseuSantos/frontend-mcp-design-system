import express, { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { StorybookContext } from './types';
import { getManifest } from './utils/get-manifest';
import { errorToMCPContent } from './utils/error-handler';
import {
  LIST_ALL_COMPONENTS_TOOL_NAME,
  listAllComponents,
} from './tools/list-all-components';
import {
  GET_COMPONENT_DOCUMENTATION_TOOL_NAME,
  getComponentDocumentation,
} from './tools/get-component-documentation';
import {
  FIND_COMPONENT_BY_NAME_TOOL_NAME,
  findComponentByName,
} from './tools/find-component-by-name';
import {
  GET_COMPONENT_STORIES_TOOL_NAME,
  getComponentStories,
} from './tools/get-component-stories';
import {
  SUGGEST_COMPOSITION_TOOL_NAME,
  suggestComposition,
} from './tools/suggest-composition';

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment variables
const PORT = parseInt(process.env.PORT || '13316', 10);
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '5000', 10);

// Storybook context cache
let storybookContext: StorybookContext | null = null;
let pollInterval: NodeJS.Timeout | null = null;

/**
 * Load Storybook metadata and update context
 */
async function loadStorybookContext(): Promise<void> {
  try {
    storybookContext = await getManifest();
    if (LOG_LEVEL === 'debug' || LOG_LEVEL === 'info') {
      console.log(
        `[MCP Server] Loaded ${storybookContext.components.size} components with ${storybookContext.stories} stories from ${storybookContext.source} mode`
      );
    }
  } catch (error) {
    console.error('[MCP Server] Error loading Storybook context:', error);
    storybookContext = {
      components: new Map(),
      stories: 0,
      source: 'static',
    };
  }
}

// Load on startup
loadStorybookContext().catch(console.error);

// Poll for updates when in dev mode
const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:5173';
if (STORYBOOK_URL && STORYBOOK_URL !== '') {
  pollInterval = setInterval(() => {
    loadStorybookContext().catch((error) => {
      if (LOG_LEVEL === 'debug') {
        console.log(`[MCP Server] Poll update failed:`, error.message);
      }
    });
  }, POLL_INTERVAL);

  if (LOG_LEVEL === 'debug' || LOG_LEVEL === 'info') {
    console.log(`[MCP Server] Polling Storybook at ${STORYBOOK_URL} every ${POLL_INTERVAL}ms`);
  }
}

// Health check endpoint
app.get('/healthz', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    loadedStories: storybookContext?.stories || 0,
    componentsCount: storybookContext?.components.size || 0,
    source: storybookContext?.source || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// Reload metadata endpoint (for debugging)
app.post('/reload', async (_req: Request, res: Response) => {
  await loadStorybookContext();
  res.json({
    status: 'reloaded',
    loadedStories: storybookContext?.stories || 0,
    componentsCount: storybookContext?.components.size || 0,
    source: storybookContext?.source || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// MCP Protocol endpoint - GET for health/availability check
app.get('/mcp', (_req: Request, res: Response) => {
  res.json({
    jsonrpc: '2.0',
    status: 'available',
    server: 'org-design-system-mcp',
    version: '1.0.0',
    endpoints: {
      health: '/healthz',
      mcp: '/mcp (POST)',
    },
  });
});

// MCP Protocol endpoint - POST for actual MCP protocol
app.post('/mcp', async (req: Request, res: Response) => {
  // Validate request format
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid request format',
      },
    });
  }

  const { method, params, id } = req.body;

  if (LOG_LEVEL === 'debug') {
    console.log(`[MCP Server] Received request: ${method}`, { id, params });
  }

  try {
    let result;

    switch (method) {
      case 'initialize':
        // MCP initialization handshake
        // Reload context before responding
        await loadStorybookContext();
        result = {
          protocolVersion: '2025-06-18',
          capabilities: {
            tools: {
              listChanged: true,
            },
            resources: {},
            prompts: {},
          },
          serverInfo: {
            name: 'org-design-system-mcp',
            version: '1.0.0',
          },
        };
        if (LOG_LEVEL === 'debug') {
          console.log(
            `[MCP Server] Initialized. Loaded ${storybookContext?.components.size || 0} components, ${storybookContext?.stories || 0} stories`
          );
        }
        break;

      case 'tools/list':
        result = {
          tools: [
            {
              name: LIST_ALL_COMPONENTS_TOOL_NAME,
              description: 'List all available components from the design system',
              inputSchema: {
                type: 'object',
                properties: {},
              },
            },
            {
              name: FIND_COMPONENT_BY_NAME_TOOL_NAME,
              description: 'Find a component by name (case-insensitive partial match)',
              inputSchema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Component name to search for',
                  },
                },
                required: ['name'],
              },
            },
            {
              name: GET_COMPONENT_STORIES_TOOL_NAME,
              description: 'Get all stories for a specific component',
              inputSchema: {
                type: 'object',
                properties: {
                  componentId: {
                    type: 'string',
                    description: 'Component ID or name',
                  },
                },
                required: ['componentId'],
              },
            },
            {
              name: GET_COMPONENT_DOCUMENTATION_TOOL_NAME,
              description: 'Get detailed documentation for a specific UI component',
              inputSchema: {
                type: 'object',
                properties: {
                  componentId: {
                    type: 'string',
                    description: 'Component ID or name',
                  },
                },
                required: ['componentId'],
              },
            },
            {
              name: SUGGEST_COMPOSITION_TOOL_NAME,
              description: 'Suggest a composition of components for a given use case',
              inputSchema: {
                type: 'object',
                properties: {
                  useCase: {
                    type: 'string',
                    description: 'Description of the use case or screen to build',
                  },
                },
                required: ['useCase'],
              },
            },
          ],
        };
        break;

      case 'tools/call':
        const { name, arguments: args } = params || {};

        if (!name) {
          if (LOG_LEVEL === 'debug' || LOG_LEVEL === 'info') {
            console.error(`[MCP Server] tools/call - ERROR: Tool name is missing`);
          }
          result = {
            error: {
              code: 'INVALID_PARAMS',
              message: 'Tool name is required',
            },
          };
          break;
        }

        if (!storybookContext) {
          await loadStorybookContext();
        }

        if (!storybookContext) {
          result = {
            error: {
              code: 'CONTEXT_NOT_LOADED',
              message: 'Storybook context not available. Please try again.',
            },
          };
          break;
        }

        try {
          if (LOG_LEVEL === 'debug') {
            console.log(`[MCP Server] tools/call - Calling tool: ${name}`);
          }
          switch (name) {
            case LIST_ALL_COMPONENTS_TOOL_NAME:
              result = await listAllComponents(storybookContext);
              break;

            case FIND_COMPONENT_BY_NAME_TOOL_NAME:
              result = await findComponentByName(
                { name: args?.name || '' },
                storybookContext
              );
              break;

            case GET_COMPONENT_STORIES_TOOL_NAME:
              result = await getComponentStories(
                { componentId: args?.componentId || '' },
                storybookContext
              );
              break;

            case GET_COMPONENT_DOCUMENTATION_TOOL_NAME:
              result = await getComponentDocumentation(
                { componentId: args?.componentId || '' },
                storybookContext
              );
              break;

            case SUGGEST_COMPOSITION_TOOL_NAME:
              result = await suggestComposition(
                { useCase: args?.useCase || '' },
                storybookContext
              );
              break;

            default:
              result = {
                error: {
                  code: 'METHOD_NOT_FOUND',
                  message: `Unknown tool: ${name}`,
                },
              };
          }
        } catch (error) {
          const errorContent = errorToMCPContent(error);
          result = {
            error: {
              code: 'TOOL_EXECUTION_ERROR',
              message: errorContent.content[0].text,
            },
          };
        }
        break;

      case 'resources/list':
        // Return empty resources list (we don't use resources in this server)
        result = {
          resources: [],
        };
        break;

      default:
        result = {
          error: {
            code: 'METHOD_NOT_FOUND',
            message: `Unknown method: ${method}`,
          },
        };
    }

    // Handle error responses properly
    if (result && typeof result === 'object' && 'error' in result) {
      const errorResponse = {
        jsonrpc: '2.0',
        id: req.body.id ?? null,
        error: result.error,
      };
      
      if (LOG_LEVEL === 'debug') {
        console.log(`[MCP Server] Sending error response for ${method}:`, JSON.stringify(errorResponse, null, 2));
      }
      
      return res.status(400).json(errorResponse);
    }
    
    // Ensure result is always an object (not null/undefined)
    if (!result) {
      result = {};
    }
    
    const response = {
      jsonrpc: '2.0',
      id: req.body.id ?? null,
      result,
    };
    
    if (LOG_LEVEL === 'debug') {
      console.log(`[MCP Server] Sending response for ${method}:`, JSON.stringify(response, null, 2));
    }
    
    // Always return 200 for successful responses
    res.status(200).json(response);
  } catch (error) {
    console.error('[MCP Server] Error handling request:', error);
    const errorContent = errorToMCPContent(error);
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body.id || null,
      error: {
        code: 'INTERNAL_ERROR',
        message: errorContent.content[0].text,
      },
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`[MCP Server] Listening on http://localhost:${PORT}`);
  console.log(`[MCP Server] MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`[MCP Server] Health check: http://localhost:${PORT}/healthz`);
  console.log(
    `[MCP Server] Loaded ${storybookContext?.components.size || 0} components, ${storybookContext?.stories || 0} stories`
  );
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[MCP Server] SIGTERM received, shutting down gracefully');
  if (pollInterval) {
    clearInterval(pollInterval);
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[MCP Server] SIGINT received, shutting down gracefully');
  if (pollInterval) {
    clearInterval(pollInterval);
  }
  process.exit(0);
});
