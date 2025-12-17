'use client';

import { useFabrics } from '@/lib/hooks/useFabrics';

export default function TestFabricsPage() {
    const { fabrics, meta, loading, error } = useFabrics({
        page: 1,
        per_page: 10,
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Chargement des tissus...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-2xl p-8">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                        <pre className="text-sm text-red-800 overflow-auto">{error}</pre>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Test Fabrics Endpoint</h1>
                <p className="text-gray-600 mb-8">
                    Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">marketplace-fabrics-list</code>
                </p>

                {/* Meta Info */}
                {meta && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h2 className="font-semibold text-blue-900 mb-2">Pagination Info</h2>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-blue-700">Page:</span>{' '}
                                <span className="font-mono">{meta.page}</span>
                            </div>
                            <div>
                                <span className="text-blue-700">Per Page:</span>{' '}
                                <span className="font-mono">{meta.per_page}</span>
                            </div>
                            <div>
                                <span className="text-blue-700">Total:</span>{' '}
                                <span className="font-mono">{meta.total}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {fabrics.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <h2 className="font-semibold text-green-900 mb-2">✅ Endpoint Fonctionne !</h2>
                        <p className="text-green-700 text-sm">
                            {fabrics.length} tissu(s) récupéré(s) avec succès
                        </p>
                    </div>
                )}

                {/* Fabrics List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Tissus ({fabrics.length})</h2>

                    {fabrics.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                            <p className="text-yellow-800">Aucun tissu trouvé</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {fabrics.map((fabric) => (
                                <div
                                    key={fabric.id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                                >
                                    {/* Image */}
                                    {fabric.images && fabric.images.length > 0 && (
                                        <div className="mb-3 h-40 bg-gray-100 rounded overflow-hidden">
                                            <img
                                                src={fabric.images[0]}
                                                alt={fabric.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <h3 className="font-bold text-lg mb-2">{fabric.name}</h3>

                                    {fabric.texture && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            Texture: <span className="font-medium">{fabric.texture}</span>
                                        </p>
                                    )}

                                    <p className="text-lg font-semibold text-gray-900 mb-2">
                                        {fabric.price_per_meter.toLocaleString()} F/mètre
                                    </p>

                                    {/* Color */}
                                    {fabric.couleur && (
                                        <div className="mb-2">
                                            <p className="text-xs text-gray-500 mb-1">Couleur:</p>
                                            <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                                                {fabric.couleur}
                                            </span>
                                        </div>
                                    )}

                                    {/* Stock */}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Stock:</span>
                                        <span className={`font-semibold ${fabric.stock_disponible ? 'text-green-600' : 'text-red-600'}`}>
                                            {fabric.stock_disponible ? 'Disponible' : 'Épuisé'}
                                        </span>
                                    </div>

                                    {/* ID & Date */}
                                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                                        <p>ID: {fabric.id}</p>
                                        <p>Créé: {new Date(fabric.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Raw JSON Debug */}
                <details className="mt-8">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        Voir les données brutes (JSON)
                    </summary>
                    <div className="mt-2 bg-gray-900 text-green-400 rounded-lg p-4 overflow-auto">
                        <pre className="text-xs">{JSON.stringify({ data: fabrics, meta }, null, 2)}</pre>
                    </div>
                </details>
            </div>
        </div>
    );
}
