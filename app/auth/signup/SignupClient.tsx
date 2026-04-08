'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/api/supabase-client';

export default function SignupClient() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const phoneClean = form.phone.replace(/\s|-/g, '');
    const isPhoneValid = /^\+22901\d{8}$/.test(phoneClean) || /^\d{10}$/.test(phoneClean);

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPhoneValid) {
            setError('Format téléphone invalide (ex: 0164000001 ou +2290164000001).');
            return;
        }
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    first_name: form.firstName.trim(),
                    last_name: form.lastName.trim(),
                    phone: phoneClean,
                },
            },
        });

        if (error) {
            setError(error.message === 'User already registered'
                ? 'Un compte existe déjà avec cet email.'
                : 'Erreur lors de la création du compte. Réessayez.');
            setLoading(false);
        } else {
            router.push('/profile');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pt-24">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md border border-gray-200 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
                <p className="text-gray-600 mb-8">Rejoignez DressArt pour suivre vos commandes.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Prénom</label>
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={handleChange('firstName')}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                                placeholder="Pierre"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Nom</label>
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={handleChange('lastName')}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                                placeholder="DOSSOU"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Téléphone</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={handleChange('phone')}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="+229 01 XX XX XX XX"
                        />
                        {form.phone && !isPhoneValid && (
                            <p className="mt-1 text-sm text-red-600">Format invalide (ex: 0164000001).</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={handleChange('email')}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Mot de passe</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={handleChange('password')}
                            required
                            minLength={8}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="8 caractères minimum"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Création...' : 'Créer mon compte'}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Déjà un compte ?{' '}
                    <Link href="/auth/login" className="font-semibold text-gray-900 underline underline-offset-4">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}
