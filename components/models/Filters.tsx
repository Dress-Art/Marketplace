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

    const resetFilters = () => {
        onTypeChange('');
        onDesignerChange('');
        onPriceRangeChange('');
    };

    return (
        <div className="mb-8 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="font-medium">Réinitialiser</span>
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="space-y-6">
                {/* Type */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Type</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onTypeChange('')}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${!selectedType
                                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                                }`}
                        >
                            Tous
                        </button>
                        {types.map((type) => (
                            <button
                                key={type}
                                onClick={() => onTypeChange(type)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedType === type
                                        ? 'bg-gray-900 text-white shadow-lg scale-105'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Designer */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Designer</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onDesignerChange('')}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${!selectedDesigner
                                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                                }`}
                        >
                            Tous
                        </button>
                        {designers.map((designer) => (
                            <button
                                key={designer}
                                onClick={() => onDesignerChange(designer)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedDesigner === designer
                                        ? 'bg-gray-900 text-white shadow-lg scale-105'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                                    }`}
                            >
                                {designer}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Prix */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Prix</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onPriceRangeChange('')}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${!priceRange
                                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                                }`}
                        >
                            Tous
                        </button>
                        {priceRanges.map((range) => (
                            <button
                                key={range.value}
                                onClick={() => onPriceRangeChange(range.value)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${priceRange === range.value
                                        ? 'bg-gray-900 text-white shadow-lg scale-105'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
