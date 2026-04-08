"use client";

import { getOrderStatusColor } from "@/lib/utils/order-status";

interface OrderStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export default function OrderStatusBadge({ status, size = "md", className = "" }: OrderStatusBadgeProps) {
  const sizeClasses = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2";
  const colorClasses = getOrderStatusColor(status);

  return (
    <span
      className={`rounded-full border font-semibold ${sizeClasses} ${colorClasses} ${className}`}
      role="status"
      aria-label={`Statut: ${status}`}
    >
      {status}
    </span>
  );
}
