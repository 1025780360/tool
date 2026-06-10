import { lazy } from 'react';
import { registerTool } from '@/config/tool.registry';
import { ToolCategory } from '@/types/category';

registerTool({
  id: 'url-encode',
  name: 'URL 编解码',
  description: 'URL 编码与解码，处理特殊字符',
  category: ToolCategory.ENCODING,
  tags: ['url', '编码', '解码', 'encodeURI', 'decodeURI'],
  route: '/tools/url-encode',
  icon: 'link',
  component: lazy(() => import('./UrlEncodePage')),
});
