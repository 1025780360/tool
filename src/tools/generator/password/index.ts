import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'password-generator',
  name: '密码生成器',
  description: '生成安全的随机密码',
  category: ToolCategory.GENERATOR,
  tags: ['password', '密码', '随机', '安全'],
  route: '/tools/password-generator',
  icon: 'key-round',
  component: lazy(() => import('./PasswordPage')),
  featured: true,
});
