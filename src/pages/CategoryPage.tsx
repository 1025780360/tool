import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getToolsByCategory } from '@/config/tool.registry';
import { CATEGORIES, ToolCategory } from '@/types/category';
import { ToolGrid } from '@/components/common/ToolGrid';
import styles from './CategoryPage.module.css';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  const category = categoryId ? CATEGORIES[categoryId as ToolCategory] : undefined;
  const tools = useMemo(() => {
    if (!categoryId) return [];
    return getToolsByCategory(categoryId as ToolCategory);
  }, [categoryId]);

  if (!category) {
    return (
      <div className={styles.page}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={16} />
          返回首页
        </Link>
        <div className={styles.notFound}>
          <h2>分类不存在</h2>
          <p>请检查 URL 或返回首页浏览所有工具</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        <ArrowLeft size={16} />
        返回首页
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title} style={{ color: category.color }}>
          {category.label}
        </h1>
        <p className={styles.desc}>{category.description}</p>
        <span className={styles.count}>{tools.length} 个工具</span>
      </div>

      <ToolGrid tools={tools} emptyMessage="该分类下暂无工具" />
    </div>
  );
}
