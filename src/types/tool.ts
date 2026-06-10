import type { ComponentType, LazyExoticComponent } from 'react';
import type { ToolCategory } from './category';

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  route: string;
  icon: string;
  component: LazyExoticComponent<ComponentType<object>>;
  featured?: boolean;
  usesWorker?: boolean;
}
