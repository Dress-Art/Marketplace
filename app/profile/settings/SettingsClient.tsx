'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/api/supabase-client';
import { useAuth } from '@/lib/hooks/useAuth';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';

export default function SettingsClient() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    // Email
    const [email, setEmail] = useState('');
    const [emailSaving, setEmailSaving] = useState(false);
    const [emailMsg, setEmailMsg] = useState('');

    // Mot de passe
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState('');

    useEffect(() => {
        if (!authLoading && !user) router.replace('/auth/login');
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user?.email) setEmail(user.email);
    }, [user]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const handleSaveEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailSaving(true);
        setEmailMsg('');

        const { error } = await supabase.auth.updateUser({ email });
        if (error) {
            setEmailMsg('Erreur : ' + error.message);
        } else {
            setEmailMsg('Un lien de confirmation a été envoyé à cette adresse.');
        }
        setEmailSaving(false);
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            setPasswordMsg('Les mots de passe ne correspondent pas.');
            return;
        }
        if (password.length < 8) {
            setPasswordMsg('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        setPasswordSaving(true);
        setPasswordMsg('');

        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setPasswordMsg('Erreur : ' + error.message);
        } else {
            setPasswordMsg('Mot de passe mis à jour avec succès.');
            setPassword('');
            setPasswordConfirm('');
        }
        setPasswordSaving(false);
    };

    const phone = user.phone ?? user.user_metadata?.phone ?? '—';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Bouton retour */}
            <div className="fixed top-14 left-4 z-[60]">
                <Link
                    href="/profile"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border border-gray-200 bg-white shadow-sm flex items-center justify-center"
                    aria-label="Retour"
                >
                    <ArrowLeftIcon size={24} className="text-gray-700" />
                </Link>
            </div>

            <main className="max-w-2xl mx-auto px-6 py-12 pt-24 space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Paramètres du compte</h1>

                {/* Numéro de téléphone (non modifiable) */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Numéro WhatsApp</h2>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700 font-medium">
                        {phone}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Le numéro de téléphone ne peut pas être modifié.</p>
                </div>

                {/* Email */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Adresse email</h2>
                    <p className="text-sm text-gray-500 mb-4">Optionnel — pour recevoir vos notifications par email.</p>
                    <form onSubmit={handleSaveEmail} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setEmailMsg(''); }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="votre@email.com"
                        />
                        {emailMsg && (
                            <p className={`text-sm ${emailMsg.startsWith('Erreur') ? 'text-red-600' : 'text-green-600'}`}>
                                {emailMsg}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={emailSaving || !email}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {emailSaving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </form>
                </div>

                {/* Mot de passe */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Mot de passe</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Optionnel — si défini, vous pourrez choisir entre code OTP et mot de passe à la connexion.
                    </p>
                    <form onSubmit={handleSavePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setPasswordMsg(''); }}
                                minLength={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                                placeholder="8 caractères minimum"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={e => { setPasswordConfirm(e.target.value); setPasswordMsg(''); }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                                placeholder="••••••••"
                            />
                        </div>
                        {passwordMsg && (
                            <p className={`text-sm ${passwordMsg.startsWith('Erreur') || passwordMsg.includes('ne correspondent') ? 'text-red-600' : 'text-green-600'}`}>
                                {passwordMsg}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={passwordSaving || !password || !passwordConfirm}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {passwordSaving ? 'Enregistrement...' : 'Définir le mot de passe'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
