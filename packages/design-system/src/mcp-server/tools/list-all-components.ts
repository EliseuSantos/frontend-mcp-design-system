/**
 * Tool: list-all-components
 * Lists all available components from the design system
 */

import type { StorybookContext } from '../types';

export const LIST_ALL_COMPONENTS_TOOL_NAME = 'list-all-components';

export interface ListAllComponentsInput {
  // No input required
}

export interface ListAllComponentsOutput {
  components: Array<{
    id: string;
    name: string;
    title: string;
    storiesCount: number;
    description?: string;
  }>;
}

export async function listAllComponents(
  context: StorybookContext
): Promise<ListAllComponentsOutput> {
  const components = Array.from(context.components.values()).map((comp) => ({
    id: comp.id,
    name: comp.name,
    title: comp.title,
    storiesCount: comp.stories.length,
    description: comp.description,
  }));

  return { components };
}

