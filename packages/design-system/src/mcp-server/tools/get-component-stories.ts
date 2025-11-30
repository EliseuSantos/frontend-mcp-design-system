/**
 * Tool: get-component-stories
 * Get all stories for a specific component
 */

import type { StorybookContext } from '../types';

export const GET_COMPONENT_STORIES_TOOL_NAME = 'get-component-stories';

export interface GetComponentStoriesInput {
  componentId: string;
}

export interface GetComponentStoriesOutput {
  component?: {
    id: string;
    name: string;
    title: string;
    description?: string;
    stories: Array<{
      id: string;
      name: string;
    }>;
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function getComponentStories(
  input: GetComponentStoriesInput,
  context: StorybookContext
): Promise<GetComponentStoriesOutput> {
  const component = context.components.get(input.componentId.toLowerCase());
  
  if (!component) {
    // Try to find by name
    const found = Array.from(context.components.values()).find(
      (c) => c.name.toLowerCase() === input.componentId.toLowerCase() ||
             c.id.toLowerCase() === input.componentId.toLowerCase()
    );
    
    if (!found) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: `Component '${input.componentId}' not found. Use list-all-components to see available components.`,
        },
      };
    }
    
    return {
      component: {
        id: found.id,
        name: found.name,
        title: found.title,
        description: found.description,
        stories: found.stories,
      },
    };
  }
  
  return {
    component: {
      id: component.id,
      name: component.name,
      title: component.title,
      description: component.description,
      stories: component.stories,
    },
  };
}

