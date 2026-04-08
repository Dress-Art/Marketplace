"use client";

interface SuiviEmptyStateProps {
  message: string;
  className?: string;
}

export default function SuiviEmptyState({ message, className = "" }: SuiviEmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 ${className}`}
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
