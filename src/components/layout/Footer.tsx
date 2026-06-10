import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.text}>
          © {new Date().getFullYear()} 在线工具箱 — 所有工具均在浏览器本地运行，数据不会上传到服务器
        </p>
      </div>
    </footer>
  );
}
