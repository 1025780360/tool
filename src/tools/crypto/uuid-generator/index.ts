import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'uuid-generator',
  name: 'UUID 生成器',
  description: '生成 UUID v4 随机标识符',
  category: ToolCategory.CRYPTO,
  tags: ['uuid', 'guid', '随机', '标识符', 'id'],
  route: '/tools/uuid-generator',
  icon: 'fingerprint',
  component: lazy(() => import('./UuidGeneratorPage')),
});
