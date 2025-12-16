'use client';

import { useState } from 'react';

export default function TestModelsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testAPI = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/models', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page: 1, per_page: 5 }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            setData(result);
            console.log('🔍 Models API Response:', result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Test Models API</h1>

                <button
                    onClick={testAPI}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 mb-6"
                >
                    {loading ? 'Testing...' : 'Test API'}
                </button>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800 font-semibold">Error:</p>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {data && (
                    <div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-green-800 font-semibold">✅ Success!</p>
                            <p className="text-green-700">
                                {data.data?.length || 0} models returned
                            </p>
                        </div>

                        <details open>
                            <summary className="cursor-pointer text-lg font-semibold mb-4">
                                Response Data
                            </summary>
                            <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-auto max-h-96">
                                <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}
