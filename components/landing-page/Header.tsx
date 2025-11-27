'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchIcon from '@/components/icons/SearchIcon';
import ShoppingCartIcon from '@/components/icons/ShoppingCartIcon';

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Recherche:', searchQuery);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    return (
        <header className="w-full max-w-7xl mx-auto py-4 px-6 bg-background relative z-50">
            <div className="flex items-center justify-between gap-4">
                {/* Logo à gauche */}
                <div className="z-50">
                    <h1 className="text-3xl font-bold text-gray-900">
                        DressArt
                    </h1>
                </div>

                {/* Menu de navigation Desktop */}
                <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                    <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        Accueil
                    </Link>
                    <Link href="/models" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        Models
                    </Link>
                    <Link href="/suivi" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        Suivi
                    </Link>
                </nav>

                {/* Actions à droite */}
                <div className="flex items-center gap-4 z-50">
                    {/* Zone de recherche */}
                    <div className="rounded-full overflow-hidden transition-all duration-300 ease-in-out hidden sm:block"
                        style={{
                            width: isSearchOpen ? '300px' : '40px',
                            maxWidth: '100%'
                        }}>
                        {!isSearchOpen ? (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors w-full h-full cursor-pointer"
                                aria-label="Rechercher"
                            >
                                <SearchIcon className="w-6 h-6 text-gray-700" />
                            </button>
                        ) : (
                            <form onSubmit={handleSearchSubmit} className="flex items-center px-4 py-2 bg-gray-100 rounded-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher..."
                                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-600"
                                    autoFocus
                                    onBlur={() => {
                                        if (!searchQuery) {
                                            setIsSearchOpen(false);
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="ml-2 cursor-pointer"
                                    aria-label="Envoyer la recherche"
                                >
                                    <SearchIcon className="w-5 h-5 text-gray-700" />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Icône panier */}
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                        aria-label="Panier"
                    >
                        <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Hamburger Menu Button (Mobile) */}
                    <button
                        className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors z-50"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menu"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span className={`w-full h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-full h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl">
                    <Link
                        href="/"
                        className="text-gray-900 font-medium hover:text-gray-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Accueil
                    </Link>
                    <Link
                        href="/models"
                        className="text-gray-900 font-medium hover:text-gray-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Models
                    </Link>
                    <Link
                        href="/suivi"
                        className="text-gray-900 font-medium hover:text-gray-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Suivi
                    </Link>
                </div>
            </div>
        </header>
    );
}
