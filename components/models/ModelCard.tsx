import Image from 'next/image';
import Link from 'next/link';

interface ModelCardProps {
    id: number;
    image: string;
    titre: string;
    description: string;
    width: number;
    height: number;
}

export default function ModelCard({ id, image, titre, description, width, height }: ModelCardProps) {
    return (
        <Link href={`/models/${id}/tissus`}>
            <div
                className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                    breakInside: 'avoid',
                    display: 'inline-block',
                    width: '100%'
                }}
            >
                {/* Image avec skeleton loader */}
                <div className="relative w-full">
                    {/* Skeleton loader pendant le chargement */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-2xl"
                        style={{
                            aspectRatio: `${width} / ${height}`,
                            backgroundSize: '200% 100%'
                        }}
                    />

                    <Image
                        src={image}
                        alt={titre}
                        width={width}
                        height={height}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110 rounded-2xl relative"
                        loading="lazy"
                    />
                </div>

                {/* Overlay avec glassmorphism */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-10">
                    <div className="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-sm">
                        <h3 className="text-white text-lg font-bold mb-1">
                            {titre}
                        </h3>
                        <p className="text-white/90 text-xs">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
