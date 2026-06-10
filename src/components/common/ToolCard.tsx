import { Link } from 'react-router-dom';
import type { ToolConfig } from '@/types/tool';
import { CATEGORIES } from '@/types/category';
import { cn } from '@/utils/cn';
import styles from './ToolCard.module.css';

// Dynamic icon component
import { icons } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

function getIcon(name: string): LucideIcon {
  // Convert kebab-case to PascalCase for lucide-react icons
  const pascal = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return (icons as Record<string, LucideIcon>)[pascal] ?? icons.Wrench;
}

interface ToolCardProps {
  tool: ToolConfig;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = getIcon(tool.icon);
  const category = CATEGORIES[tool.category];

  return (
    <Link
      to={tool.route}
      className={cn(styles.card, tool.featured && styles.featured)}
      title={tool.description}
    >
      <div
        className={styles.iconWrapper}
        style={{ backgroundColor: category.color + '15', color: category.color }}
      >
        <Icon size={22} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{tool.name}</h3>
        <p className={styles.desc}>{tool.description}</p>
      </div>
      <span
        className={styles.categoryTag}
        style={{ backgroundColor: category.color + '12', color: category.color }}
      >
        {category.label}
      </span>
    </Link>
  );
}
