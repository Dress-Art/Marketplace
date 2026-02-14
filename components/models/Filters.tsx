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
    { value: '0-10000', label: 'Moins de 10K' },
    { value: '10000-20000', label: '10K - 20K' },
    { value: '20000-30000', label: '20K - 30K' },
    { value: '30000-99999', label: 'Plus de 30K' },
];

export default function Filters({
    selectedType,
    selectedDesigner,
    priceRange,
    onTypeChange,
    onDesignerChange,
    onPriceRangeChange,
    types,
}: FiltersProps) {
    const hasActiveFilters = selectedType || selectedDesigner || priceRange;
    const activeFilterCount = [selectedType, priceRange].filter(Boolean).length;

    const resetFilters = () => {
        onTypeChange('');
        onDesignerChange('');
        onPriceRangeChange('');
    };

    return (
        <div className="w-full mb-8">
            {/* Premium Filter Container */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-100">
                {/* Filter Label - Hidden on small mobile to save space */}
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">
                        Filtrer par
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 flex-1">
                    {/* Category Filter */}
                    <div className="relative group">
                        <select
                            value={selectedType}
                            onChange={(e) => onTypeChange(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b-2 border-transparent hover:border-gray-900 focus:border-gray-900 text-sm font-medium text-gray-900 transition-all cursor-pointer outline-none"
                        >
                            <option value="">Catégories</option>
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-900 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="relative group">
                        <select
                            value={priceRange}
                            onChange={(e) => onPriceRangeChange(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 bg-transparent border-b-2 border-transparent hover:border-gray-900 focus:border-gray-900 text-sm font-medium text-gray-900 transition-all cursor-pointer outline-none"
                        >
                            <option value="">Budget</option>
                            {priceRanges.map((range) => (
                                <option key={range.value} value={range.value}>
                                    {range.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-900 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Active Filter Indicators */}
                    {activeFilterCount > 0 && (
                        <div className="flex items-center gap-2 animate-fade-in pl-4 border-l border-gray-100">
                            <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                                {activeFilterCount} actif{activeFilterCount > 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                {/* Reset Action */}
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all cursor-pointer flex items-center gap-2 group"
                    >
                        <span>Réinitialiser</span>
                        <svg className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
