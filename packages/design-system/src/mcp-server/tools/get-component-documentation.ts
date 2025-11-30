/**
 * Tool: get-component-documentation
 * Get detailed documentation for a specific UI component
 */

import type { StorybookContext, ComponentInfo } from '../types';
import { formatComponentManifest } from '../utils/format-manifest';

export const GET_COMPONENT_DOCUMENTATION_TOOL_NAME = 'get-component-documentation';

export interface GetComponentDocumentationInput {
  componentId: string;
}

export interface GetComponentDocumentationOutput {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

export async function getComponentDocumentation(
  input: GetComponentDocumentationInput,
  context: StorybookContext
): Promise<GetComponentDocumentationOutput> {
  const component = context.components.get(input.componentId.toLowerCase());
  
  if (!component) {
    // Try to find by name
    const found = Array.from(context.components.values()).find(
      (c) => c.name.toLowerCase() === input.componentId.toLowerCase() ||
             c.id.toLowerCase() === input.componentId.toLowerCase()
    );
    
    if (!found) {
      const availableIds = Array.from(context.components.keys()).join(', ');
      return {
        content: [
          {
            type: 'text',
            text: `Component not found: "${input.componentId}". Available components: ${availableIds}. Use the list-all-components tool to see all available components.`,
          },
        ],
        isError: true,
      };
    }
    
    return {
      content: [
        {
          type: 'text',
          text: formatComponentManifest(found, 'markdown'),
        },
      ],
    };
  }
  
  return {
    content: [
      {
        type: 'text',
        text: formatComponentManifest(component, 'markdown'),
      },
    ],
  };
}

