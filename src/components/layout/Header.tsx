import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Moon, Sun } from 'lucide-react';
import { SearchBar } from '../common/SearchBar';
import { useFilterDispatch } from '@/hooks/useToolFilter';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const dispatch = useFilterDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSearch = (query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
    if (query) {
      navigate('/');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <Wrench size={24} />
          <span className={styles.logoText}>在线工具箱</span>
        </Link>
        <div className={styles.searchWrapper}>
          <SearchBar onSearch={handleSearch} />
        </div>
        <nav className={styles.nav}>
          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
