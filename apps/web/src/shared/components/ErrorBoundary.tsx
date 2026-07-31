import { Component, type ReactNode } from 'react';

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

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-top p-6">
          <div className="text-center max-w-sm">
            {/* 오류 아이콘 */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-3xl text-red-400" />
            </div>

            <h2 className="text-xl font-bold text-ivory mb-2">
              앗, 오류가 발생했어요
            </h2>
            <p className="text-ivory/60 text-sm mb-6 leading-relaxed">
              일시적인 문제일 수 있어요.
              <br />
              아래 버튼을 눌러 다시 시도해 주세요.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-xl bg-gold/90 text-bg-top font-semibold text-sm
                           hover:bg-gold transition-colors active:scale-[0.98]"
              >
                <i className="fas fa-redo mr-2" />
                다시 시도
              </button>
              <button
                onClick={() => { window.location.href = '/home'; }}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-ivory/80
                           font-medium text-sm hover:bg-white/10 transition-colors active:scale-[0.98]"
              >
                <i className="fas fa-home mr-2" />
                홈으로 돌아가기
              </button>
            </div>

            {/* 디버그 정보 (개발 모드) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-ivory/40 cursor-pointer">
                  오류 상세 (개발 모드)
                </summary>
                <pre className="mt-2 p-3 rounded-lg bg-white/5 text-xs text-red-300
                               overflow-auto max-h-40 whitespace-pre-wrap">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
