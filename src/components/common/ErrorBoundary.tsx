import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className={styles.wrapper}>
          <AlertTriangle size={48} className={styles.icon} />
          <h2 className={styles.title}>出错了</h2>
          <p className={styles.message}>
            {this.state.error?.message || '发生了未知错误'}
          </p>
          <button className={styles.resetBtn} onClick={this.handleReset}>
            <RefreshCw size={16} />
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
