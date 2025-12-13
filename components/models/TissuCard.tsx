import Image from 'next/image';

interface TissuCardProps {
    tissu: any;
    modelId: string;
    isSelected?: boolean;
    onSelect?: (id: number) => void;
}

export default function TissuCard({ tissu, modelId, isSelected = false, onSelect }: TissuCardProps) {
    const handleClick = () => {
        if (onSelect) {
            onSelect(tissu.id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isSelected
                    ? 'ring-4 ring-blue-500 shadow-2xl scale-[1.02]'
                    : 'hover:shadow-xl'
                }`}
        >
            {/* Image du tissu avec skeleton */}
            <div className="relative w-full">
                {/* Skeleton loader */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-2xl"
                    style={{
                        aspectRatio: `${tissu.width} / ${tissu.height}`,
                        backgroundSize: '200% 100%'
                    }}
                />

                <Image
                    src={tissu.image}
                    alt={tissu.titre}
                    width={tissu.width}
                    height={tissu.height}
                    className="w-full h-auto object-cover rounded-2xl relative"
                    loading="lazy"
                />
            </div>

            {/* Checkmark overlay when selected */}
            {isSelected && (
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl flex items-center justify-center z-30 animate-fadeIn">
                    <div className="bg-blue-500 rounded-full p-3 shadow-lg">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>
            )}

            {/* Overlay avec infos */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 rounded-2xl ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                <div className="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-sm">
                    <h3 className="text-white text-base font-bold mb-1">
                        {tissu.titre}
                    </h3>
                    <p className="text-white/90 text-xs mb-1">
                        Qualité: {tissu.qualite}
                    </p>
                    <p className="text-white/90 text-xs mb-2">
                        Couleur: {tissu.couleur}
                    </p>
                    <p className="text-white font-bold text-sm">
                        {tissu.prix.toLocaleString('fr-FR')} FCFA
                    </p>
                </div>
            </div>

            {/* Badge prix */}
            <div className={`absolute top-3 right-3 backdrop-blur-md px-2 py-1 rounded-full border z-20 transition-all duration-300 ${isSelected
                    ? 'bg-blue-500 border-blue-300'
                    : 'bg-white/30 border-white/20'
                }`}>
                <span className={`font-semibold text-xs ${isSelected ? 'text-white' : 'text-gray-900'
                    }`}>
                    {tissu.prix.toLocaleString('fr-FR')} FCFA
                </span>
            </div>
        </div>
    );
}
