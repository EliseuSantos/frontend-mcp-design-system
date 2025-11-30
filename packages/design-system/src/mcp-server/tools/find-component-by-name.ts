/**
 * Tool: find-component-by-name
 * Find a component by name (case-insensitive partial match)
 */

import type { StorybookContext } from '../types';

export const FIND_COMPONENT_BY_NAME_TOOL_NAME = 'find-component-by-name';

export interface FindComponentByNameInput {
  name: string;
}

export interface FindComponentByNameOutput {
  components: Array<{
    id: string;
    name: string;
    title: string;
    storiesCount: number;
    description?: string;
  }>;
}

export async function findComponentByName(
  input: FindComponentByNameInput,
  context: StorybookContext
): Promise<FindComponentByNameOutput> {
  const searchName = input.name.toLowerCase();
  const found = Array.from(context.components.values()).filter(
    (comp) =>
      comp.name.toLowerCase().includes(searchName) ||
      comp.id.toLowerCase().includes(searchName) ||
      comp.title.toLowerCase().includes(searchName)
  );

  return {
    components: found.map((comp) => ({
      id: comp.id,
      name: comp.name,
      title: comp.title,
      storiesCount: comp.stories.length,
      description: comp.description,
    })),
  };
}

