import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <Wrench size={56} className={styles.icon} />
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>页面未找到</p>
      <p className={styles.hint}>你访问的页面不存在或已被移除</p>
      <Link to="/" className={styles.homeLink}>
        返回首页
      </Link>
    </div>
  );
}
