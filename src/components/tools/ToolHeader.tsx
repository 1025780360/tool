import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './ToolHeader.module.css';

interface ToolHeaderProps {
  title: string;
  description: string;
  backTo?: string;
  backLabel?: string;
}

export function ToolHeader({
  title,
  description,
  backTo = '/',
  backLabel = '返回首页',
}: ToolHeaderProps) {
  return (
    <div className={styles.header}>
      <Link to={backTo} className={styles.backLink}>
        <ArrowLeft size={16} />
        {backLabel}
      </Link>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.desc}>{description}</p>
    </div>
  );
}
