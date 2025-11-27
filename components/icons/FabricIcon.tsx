export default function FabricIcon({ size = 24, className = "" }: { size?: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {/* Rouleau de tissu */}
            <path d="M3 3h18v18H3z" />
            <path d="M3 9h18M3 15h18" />
            <path d="M9 3v18M15 3v18" />
            <circle cx="18" cy="18" r="3" />
            <path d="M18 15v6" />
        </svg>
    );
}
