import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllTools } from '@/config/tool.registry';
import { CATEGORIES, ToolCategory } from '@/types/category';
import { useSearch } from '@/hooks/useSearch';
import { useFilterState } from '@/hooks/useToolFilter';
import { useRecentTools } from '@/hooks/useRecentTools';
import { searchTools } from '@/utils/search';
import { ToolGrid } from '@/components/common/ToolGrid';
import { icons } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import styles from './HomePage.module.css';

function getIcon(name: string): LucideIcon {
  const pascal = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return (icons as Record<string, LucideIcon>)[pascal] ?? icons.Wrench;
}

export default function HomePage() {
  const { query, category } = useFilterState();
  const debouncedQuery = useSearch(query, 200);
  const allTools = getAllTools();
  const { recentTools } = useRecentTools();

  const filteredTools = useMemo(() => {
    let tools = allTools;
    if (category) {
      tools = tools.filter((t) => t.category === category);
    }
    if (debouncedQuery) {
      const results = searchTools(tools, debouncedQuery);
      return results.map((r) => r.tool);
    }
    return tools;
  }, [allTools, category, debouncedQuery]);

  const categoryEntries = Object.values(CATEGORIES);

  const isFiltering = !!debouncedQuery || !!category;

  return (
    <div className={styles.page}>
      {/* Hero */}
      {!isFiltering && (
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>在线工具箱</h1>
          <p className={styles.heroSubtitle}>
            开发者常用在线工具集合 · 所有数据在浏览器本地处理，安全无忧
          </p>
        </section>
      )}

      {/* Recent Tools */}
      {!isFiltering && recentTools.length > 0 && (
        <section className={styles.recentSection}>
          <h2 className={styles.sectionTitle}>最近使用</h2>
          <ToolGrid tools={recentTools} />
        </section>
      )}

      {/* Category Pills */}
      <section className={styles.categories}>
        {categoryEntries.map((cat) => {
          const Icon = getIcon(cat.icon);
          const isActive = category === cat.id;
          return (
            <Link
              key={cat.id}
              to={isActive ? '/' : `/category/${cat.id}`}
              className={`${styles.categoryPill} ${isActive ? styles.categoryPillActive : ''}`}
              style={{
                '--cat-color': cat.color,
              } as React.CSSProperties}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
            </Link>
          );
        })}
      </section>

      {/* Tool Grid */}
      <section className={styles.toolsSection}>
        {isFiltering && (
          <div className={styles.filterInfo}>
            <h2 className={styles.filterTitle}>
              {debouncedQuery
                ? `搜索 "${debouncedQuery}" 的结果`
                : category
                  ? CATEGORIES[category as ToolCategory]?.label
                  : '所有工具'}
            </h2>
            <span className={styles.filterCount}>{filteredTools.length} 个工具</span>
          </div>
        )}

        {!isFiltering && (
          <h2 className={styles.sectionTitle}>全部工具</h2>
        )}

        <ToolGrid
          tools={filteredTools}
          emptyMessage={debouncedQuery ? `没有找到与 "${debouncedQuery}" 相关的工具` : '该分类下暂无工具'}
        />
      </section>
    </div>
  );
}
