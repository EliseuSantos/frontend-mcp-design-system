/**
 * Format component manifest for MCP responses
 */

import type { ComponentInfo } from '../types';

export function formatComponentManifest(component: ComponentInfo, format: 'markdown' | 'json' = 'markdown'): string {
  if (format === 'json') {
    return JSON.stringify(component, null, 2);
  }

  // Markdown format
  let markdown = `# ${component.name}\n\n`;
  
  if (component.description) {
    markdown += `${component.description}\n\n`;
  }
  
  markdown += `## Details\n\n`;
  markdown += `- **ID**: \`${component.id}\`\n`;
  markdown += `- **Title**: ${component.title}\n`;
  markdown += `- **Path**: \`${component.path}\`\n`;
  markdown += `- **Stories**: ${component.stories.length}\n\n`;
  
  if (component.stories.length > 0) {
    markdown += `## Stories\n\n`;
    component.stories.forEach((story) => {
      markdown += `- **${story.name}** (\`${story.id}\`)\n`;
    });
  }
  
  return markdown;
}

