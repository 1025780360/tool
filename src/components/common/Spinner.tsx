import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 36 }: SpinnerProps) {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.spinner}
        style={{ width: size, height: size }}
      />
      <p className={styles.text}>加载中...</p>
    </div>
  );
}
