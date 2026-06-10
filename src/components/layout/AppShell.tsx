import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useRecentTools } from '@/hooks/useRecentTools';
import styles from './AppShell.module.css';

export default function AppShell() {
  const location = useLocation();
  const { addRecent } = useRecentTools();

  useEffect(() => {
    const match = location.pathname.match(/^\/tools\/(.+)/);
    if (match) {
      addRecent(match[1]);
    }
  }, [location.pathname, addRecent]);

  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
