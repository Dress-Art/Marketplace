import Link from 'next/link';
import Image from 'next/image';

interface TissuCardProps {
    tissu: any;
    modelId: string;
}

export default function TissuCard({ tissu, modelId }: TissuCardProps) {
    return (
        <Link href={`/models/${modelId}/tissus/${tissu.id}/mesure`}>
            <div
                className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
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
            </div>
        </Link>
    );
}
