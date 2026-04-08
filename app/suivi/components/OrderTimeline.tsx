"use client";

import type { SuiviTimelineStep } from "@/lib/types/suivi.types";

interface OrderTimelineProps {
  steps: SuiviTimelineStep[];
}

export default function OrderTimeline({ steps }: OrderTimelineProps) {
  return (
    <div className="space-y-4">
      {steps.map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                item.completed ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
              }`}
              aria-hidden
            />
            {index < steps.length - 1 && (
              <div
                className={`w-0.5 h-12 ${item.completed ? "bg-green-500" : "bg-gray-300"}`}
                aria-hidden
              />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p
              className={`font-semibold ${
                item.completed ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {item.step}
            </p>
            {item.date && (
              <p className="text-sm text-gray-500">
                {new Date(item.date).toLocaleDateString("fr-FR")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
