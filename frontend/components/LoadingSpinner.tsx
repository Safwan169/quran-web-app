interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className = "" }: LoadingSpinnerProps) {
  return (
    <div
      className={`h-8 w-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
