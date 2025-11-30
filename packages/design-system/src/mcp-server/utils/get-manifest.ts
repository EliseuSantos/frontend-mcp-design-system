/**
 * Get Storybook manifest (components metadata)
 */

import type { StorybookIndex, ComponentInfo, StorybookContext } from '../types';
import { readFileSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STORYBOOK_STATIC_PATH = process.env.STORYBOOK_STATIC_PATH || resolve(__dirname, '../../../storybook-static');
const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:5173';

/**
 * Load Storybook index from running instance or static build
 */
export async function getStorybookIndex(): Promise<{ index: StorybookIndex; source: 'dev' | 'static' }> {
  // Try dev mode first
  try {
    const storybookIndexUrl = `${STORYBOOK_URL}/index.json`;
    const response = await fetch(storybookIndexUrl, {
      signal: AbortSignal.timeout(2000),
    });
    
    if (response.ok) {
      const index: StorybookIndex = await response.json();
      return { index, source: 'dev' };
    }
  } catch (error) {
    // Fall through to static build
  }

  // Fallback to static build
  const indexPath = join(STORYBOOK_STATIC_PATH, 'index.json');
  
  if (!existsSync(indexPath)) {
    throw new Error(`Storybook index not found at ${indexPath}. Run 'storybook:build' first.`);
  }

  const indexContent = readFileSync(indexPath, 'utf-8');
  const index: StorybookIndex = JSON.parse(indexContent);
  return { index, source: 'static' };
}

/**
 * Process Storybook index into component manifest
 */
export function processStorybookIndex(index: StorybookIndex): StorybookContext {
  const componentsMap = new Map<string, ComponentInfo>();
  
  Object.values(index.entries).forEach((story) => {
    // Skip docs entries, only process actual stories
    if (story.type === 'docs') {
      return;
    }
    
    // Only process story entries
    if (story.type !== 'story') {
      return;
    }
    
    const componentTitle = story.title.split('/').pop() || story.title;
    
    if (!componentsMap.has(componentTitle)) {
      componentsMap.set(componentTitle, {
        id: componentTitle.toLowerCase().replace(/\s+/g, '-'),
        name: componentTitle,
        title: story.title,
        path: story.importPath,
        stories: [],
        description: story.parameters?.docs?.description?.component,
      });
    }
    
    const component = componentsMap.get(componentTitle)!;
    component.stories.push({
      id: story.id,
      name: story.name,
    });
  });
  
  const storyCount = Object.values(index.entries).filter(e => e.type === 'story').length;
  
  return {
    components: componentsMap,
    stories: storyCount,
    source: 'dev', // Will be set by caller
  };
}

/**
 * Get component manifest (all components)
 */
export async function getManifest(): Promise<StorybookContext> {
  const { index, source } = await getStorybookIndex();
  const context = processStorybookIndex(index);
  context.source = source;
  return context;
}

