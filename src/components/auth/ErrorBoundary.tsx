import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center flex flex-col items-center gap-4 bg-(--bg-surface) rounded-2xl border border-(--error)/30">
          <h2 className="text-xl font-bold text-(--error)">Something went wrong.</h2>
          <p className="text-(--text-secondary)">The module failed to load. Try refreshing the page.</p>
          <button 
            className="px-4 py-2 bg-(--brand) text-white rounded-lg"
            onClick={() => window.location.reload()}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children; // Corrected: return this.props.children
  }
}
