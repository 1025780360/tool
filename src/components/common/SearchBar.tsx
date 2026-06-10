import { useState, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');
  const debouncedValue = useSearch(value, 200);
  const inputRef = useRef<HTMLInputElement>(null);

  // Notify parent when debounced value changes
  const prevDebounced = useRef(debouncedValue);
  if (prevDebounced.current !== debouncedValue) {
    prevDebounced.current = debouncedValue;
    onSearch(debouncedValue);
  }

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch]);

  return (
    <div className={styles.wrapper}>
      <Search size={18} className={styles.icon} />
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder="搜索工具... (JSON、Base64、时间戳...)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button className={styles.clearBtn} onClick={handleClear} aria-label="清除搜索">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
