export default function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="relative flex flex-col items-center gap-4">
                {/* Spinner élégant */}
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
                <p className="text-sm font-medium text-gray-600 animate-pulse">Chargement...</p>
            </div>
        </div>
    );
}
