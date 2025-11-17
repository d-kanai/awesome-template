"use client";

import { isDev } from "@/features/shared/lib/env";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { Button } from "../atoms/Button";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Client-side環境でのエラーは正常動作の範囲内（Server-side renderingのフォールバック）
    // ログ出力は行わず、UIのみでハンドリング
    console.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          reset={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

type DefaultErrorFallbackProps = {
  error: Error;
  reset: () => void;
};

function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <ErrorCard error={error} reset={reset} />
    </div>
  );
}

type ErrorCardProps = {
  error: Error;
  reset: () => void;
};

function ErrorCard({ error, reset }: ErrorCardProps) {
  return (
    <div className="max-w-md w-full mx-4 p-6 bg-card border border-border rounded-lg shadow-lg">
      <ErrorHeader />
      <ErrorMessage message={error.message} />
      <ActionButtons reset={reset} />
    </div>
  );
}

function ErrorHeader() {
  return (
    <div className="flex items-center gap-3 mb-4">
      <ErrorIcon />
      <h1 className="text-2xl font-bold text-foreground">
        エラーが発生しました
      </h1>
    </div>
  );
}

function ErrorIcon() {
  return (
    <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center flex-shrink-0">
      <svg
        className="w-6 h-6 text-destructive-foreground"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
        role="img"
        aria-label="エラー"
      >
        <title>エラー</title>
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

type ErrorMessageProps = {
  message: string;
};

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mb-6">
      <p className="text-muted-foreground mb-2">
        申し訳ございません。予期しないエラーが発生しました。
      </p>
      {isDev && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            エラー詳細
          </summary>
          <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-x-auto">
            {message}
          </pre>
        </details>
      )}
    </div>
  );
}

type ActionButtonsProps = {
  reset: () => void;
};

function ActionButtons({ reset }: ActionButtonsProps) {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex gap-3">
      <Button variant="primary" onClick={reset} className="flex-1">
        再試行
      </Button>
      <Button variant="neutral" onClick={handleGoHome} className="flex-1">
        ホームへ
      </Button>
    </div>
  );
}
