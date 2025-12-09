import Link from 'next/link';
import Image from 'next/image';

interface TissuCardProps {
    tissu: any;
    modelId: string;
    isSelected?: boolean;
    onClick?: () => void;
}

export default function TissuCard({ tissu, modelId, isSelected = false, onClick }: TissuCardProps) {
    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <Link href={`/models/${modelId}/tissus/${tissu.id}/mesure`} onClick={handleClick}>
            <div
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                    isSelected ? 'ring-4 ring-gray-900 scale-[1.02] shadow-2xl' : ''
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

                {/* Overlay avec infos */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
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
                <div className="absolute top-3 right-3 backdrop-blur-md bg-white/30 px-2 py-1 rounded-full border border-white/20 z-20">
                    <span className="text-gray-900 font-semibold text-xs">
                        {tissu.prix.toLocaleString('fr-FR')} FCFA
                    </span>
                </div>

                {/* Indicateur de sélection */}
                {isSelected && (
                    <div className="absolute top-3 left-3 bg-gray-900 text-white p-2 rounded-full z-20 shadow-lg">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        </Link>
    );
}
