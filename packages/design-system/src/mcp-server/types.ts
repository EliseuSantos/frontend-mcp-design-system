/**
 * Types for MCP Server
 */

export interface StorybookStory {
  id: string;
  name: string;
  title: string;
  importPath: string;
  type?: string;
  subtype?: string;
  tags?: string[];
  parameters?: {
    docs?: {
      description?: {
        component?: string;
      };
    };
  };
}

export interface StorybookIndex {
  v: number;
  entries: Record<string, StorybookStory>;
}

export interface ComponentInfo {
  id: string;
  name: string;
  title: string;
  path: string;
  stories: Array<{
    id: string;
    name: string;
  }>;
  description?: string;
}

export interface StorybookContext {
  components: Map<string, ComponentInfo>;
  stories: number;
  source: 'dev' | 'static';
}

