interface SearchIconProps {
    className?: string;
    size?: number;
}

export default function SearchIcon({ className = "w-6 h-6", size }: SearchIconProps) {
    const sizeValue = size ? `${size}px` : undefined;

    return (
        <svg
            className={className}
            width={sizeValue}
            height={sizeValue}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    );
}
