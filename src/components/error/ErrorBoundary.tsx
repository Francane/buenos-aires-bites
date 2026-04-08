import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex items-center justify-center p-8 text-center">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">Algo salió mal</p>
            <p className="text-sm text-muted-foreground">
              No se pudo cargar esta sección. Intentá recargar la página.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
