import type { ToolConfig } from '@/types/tool';
import type { ToolCategory } from '@/types/category';

const registry = new Map<string, ToolConfig>();

export function registerTool(config: ToolConfig): void {
  if (registry.has(config.id)) {
    console.warn(`Tool "${config.id}" is already registered. Skipping.`);
    return;
  }
  registry.set(config.id, config);
}

export function getTool(id: string): ToolConfig | undefined {
  return registry.get(id);
}

export function getAllTools(): ToolConfig[] {
  return Array.from(registry.values());
}

export function getToolsByCategory(category: ToolCategory): ToolConfig[] {
  return getAllTools().filter((t) => t.category === category);
}

export function getFeaturedTools(): ToolConfig[] {
  return getAllTools().filter((t) => t.featured);
}

export function getToolCount(): number {
  return registry.size;
}
