import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'jwt-debugger',
  name: 'JWT 调试器',
  description: '解码 JWT Token 的 Header 和 Payload',
  category: ToolCategory.ENCODING,
  tags: ['jwt', 'token', '解码', 'debug', '认证'],
  route: '/tools/jwt-debugger',
  icon: 'scroll-text',
  component: lazy(() => import('./JwtDebuggerPage')),
});
