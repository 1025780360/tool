import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'color-picker',
  name: '颜色选择器',
  description: '颜色拾取、HEX/RGB/HSL 格式转换',
  category: ToolCategory.IMAGE,
  tags: ['color', '颜色', 'hex', 'rgb', 'hsl', '调色板'],
  route: '/tools/color-picker',
  icon: 'palette',
  component: lazy(() => import('./ColorPickerPage')),
});
