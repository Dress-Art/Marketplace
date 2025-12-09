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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filtres</h2>
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer"
                    >
                        Réinitialiser
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Filtre par type */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Type de vêtement</label>
                    <select
                        value={selectedType}
                        onChange={(e) => onTypeChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
                    >
                        <option value="">Tous les types</option>
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtre par designer */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Designer</label>
                    <select
                        value={selectedDesigner}
                        onChange={(e) => onDesignerChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
                    >
                        <option value="">Tous les designers</option>
                        {designers.map((designer) => (
                            <option key={designer} value={designer}>
                                {designer}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtre par prix */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Gamme de prix</label>
                    <select
                        value={priceRange}
                        onChange={(e) => onPriceRangeChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
                    >
                        <option value="">Tous les prix</option>
                        <option value="0-10000">Moins de 10 000 FCFA</option>
                        <option value="10000-20000">10 000 - 20 000 FCFA</option>
                        <option value="20000-30000">20 000 - 30 000 FCFA</option>
                        <option value="30000-99999">Plus de 30 000 FCFA</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
