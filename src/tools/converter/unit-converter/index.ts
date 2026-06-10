import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'unit-converter',
  name: '单位换算',
  description: '长度、重量、温度、数据存储单位换算',
  category: ToolCategory.CONVERTER,
  tags: ['unit', '单位', '换算', '长度', '重量', '温度', '数据'],
  route: '/tools/unit-converter',
  icon: 'ruler',
  component: lazy(() => import('./UnitConverterPage')),
});
