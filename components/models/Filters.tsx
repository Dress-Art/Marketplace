'use client';

interface FiltersProps {
    selectedType: string;
    selectedDesigner: string;
    priceRange: string;
    onTypeChange: (type: string) => void;
    onDesignerChange: (designer: string) => void;
    onPriceRangeChange: (range: string) => void;
    types: string[];
    designers: string[];
}

const priceRanges = [
    { value: '0-10000', label: '< 10K' },
    { value: '10000-20000', label: '10-20K' },
    { value: '20000-30000', label: '20-30K' },
    { value: '30000-99999', label: '> 30K' },
];

export default function Filters({
    selectedType,
    selectedDesigner,
    priceRange,
    onTypeChange,
    onDesignerChange,
    onPriceRangeChange,
    types,
    designers,
}: FiltersProps) {
    const hasActiveFilters = selectedType || selectedDesigner || priceRange;
    const activeFilterCount = [selectedType, priceRange].filter(Boolean).length;

    const resetFilters = () => {
        onTypeChange('');
        onDesignerChange('');
        onPriceRangeChange('');
    };

    return (
        <div className="mb-6 px-4">
            {/* Compact Horizontal Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                {/* Filter Label */}
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>Filtrer par:</span>
                </div>

                {/* Type Dropdown */}
                <div className="relative">
                    <select
                        value={selectedType}
                        onChange={(e) => onTypeChange(e.target.value)}
                        className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all cursor-pointer min-w-[140px]"
                    >
                        <option value="">Tous les types</option>
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {/* Type Icon */}
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {/* Dropdown Arrow */}
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Price Dropdown */}
                <div className="relative">
                    <select
                        value={priceRange}
                        onChange={(e) => onPriceRangeChange(e.target.value)}
                        className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all cursor-pointer min-w-[140px]"
                    >
                        <option value="">Tous les prix</option>
                        {priceRanges.map((range) => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                    {/* Price Icon */}
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {/* Dropdown Arrow */}
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Active Filter Badge */}
                {activeFilterCount > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full">
                        <span>{activeFilterCount}</span>
                        <span>actif{activeFilterCount > 1 ? 's' : ''}</span>
                    </div>
                )}

                {/* Reset Button */}
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all group"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Réinitialiser</span>
                    </button>
                )}
            </div>
        </div>
    );
}
