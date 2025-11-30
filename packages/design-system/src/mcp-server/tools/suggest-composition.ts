/**
 * Tool: suggest-composition
 * Suggest a composition of components for a given use case
 */

import type { StorybookContext } from '../types';

export const SUGGEST_COMPOSITION_TOOL_NAME = 'suggest-composition';

export interface SuggestCompositionInput {
  useCase: string;
}

export interface SuggestCompositionOutput {
  useCase: string;
  suggestedComponents: string[];
  plan: string;
}

export async function suggestComposition(
  input: SuggestCompositionInput,
  context: StorybookContext
): Promise<SuggestCompositionOutput> {
  const useCase = input.useCase.toLowerCase();
  const suggestions: string[] = [];
  const usedComponents = new Set<string>();
  
  // Check for common patterns
  if (useCase.includes('header') || useCase.includes('top') || useCase.includes('nav')) {
    const header = Array.from(context.components.values()).find((c) =>
      c.name.toLowerCase().includes('header')
    );
    if (header) {
      suggestions.push(header.name);
      usedComponents.add(header.id);
    }
  }
  
  if (useCase.includes('card') || useCase.includes('grid') || useCase.includes('list')) {
    const card = Array.from(context.components.values()).find((c) =>
      c.name.toLowerCase().includes('card')
    );
    if (card) {
      suggestions.push(card.name);
      usedComponents.add(card.id);
    }
  }
  
  if (useCase.includes('button') || useCase.includes('action') || useCase.includes('cta')) {
    const button = Array.from(context.components.values()).find((c) =>
      c.name.toLowerCase().includes('button')
    );
    if (button) {
      suggestions.push(button.name);
      usedComponents.add(button.id);
    }
  }
  
  // If no specific matches, suggest all available components
  if (suggestions.length === 0) {
    suggestions.push(
      ...Array.from(context.components.values())
        .slice(0, 5)
        .map((c) => c.name)
    );
  }
  
  return {
    useCase: input.useCase,
    suggestedComponents: suggestions,
    plan: `Create a composition using: ${suggestions.join(', ')}. Import from @org/design-system and compose them according to the use case.`,
  };
}

