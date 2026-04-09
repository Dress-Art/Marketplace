'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/api/supabase-client';

type Step = 'phone' | 'otp';

export default function LoginClient() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Normalise en E.164 béninois
    const phoneClean = phone.replace(/[\s\-]/g, '');
    const phoneE164 = phoneClean.startsWith('+') ? phoneClean : `+229${phoneClean}`;
    const isPhoneValid = /^\+229\d{10}$/.test(phoneE164) || /^\+\d{10,15}$/.test(phoneE164);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPhoneValid) {
            setError('Numéro invalide (ex: 0164000001 ou +2290164000001).');
            return;
        }
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithOtp({ phone: phoneE164 });
        if (error) {
            setError('Impossible d\'envoyer le code. Vérifiez votre numéro.');
            setLoading(false);
        } else {
            setStep('otp');
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) {
            setError('Le code doit contenir 6 chiffres.');
            return;
        }
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.verifyOtp({
            phone: phoneE164,
            token: otp,
            type: 'sms',
        });

        if (error) {
            setError('Code incorrect ou expiré. Réessayez.');
            setLoading(false);
        } else {
            router.push('/profile');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pt-24">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md border border-gray-200 shadow-sm">

                {step === 'phone' && (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
                        <p className="text-gray-600 mb-8">
                            Entrez votre numéro WhatsApp, vous recevrez un code de confirmation.
                        </p>

                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Numéro WhatsApp</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => { setPhone(e.target.value); setError(''); }}
                                    required
                                    autoFocus
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    placeholder="+229 01 XX XX XX XX"
                                />
                                {phone && !isPhoneValid && (
                                    <p className="mt-1 text-sm text-red-600">Format invalide.</p>
                                )}
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading || !isPhoneValid}
                                className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Envoi...' : 'Recevoir le code'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'otp' && (
                    <>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Code de confirmation</h1>
                        <p className="text-gray-600 mb-8">
                            Un code à 6 chiffres a été envoyé sur WhatsApp au{' '}
                            <span className="font-semibold text-gray-900">{phoneE164}</span>.
                        </p>

                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Code OTP</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={otp}
                                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                                    required
                                    autoFocus
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-center text-2xl tracking-[0.5em] font-mono"
                                    placeholder="------"
                                />
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Vérification...' : 'Se connecter'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                                className="w-full py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                ← Changer de numéro
                            </button>
                        </form>
                    </>
                )}

                <p className="text-center text-gray-500 text-sm mt-6">
                    En vous connectant, vous acceptez nos{' '}
                    <Link href="/cgv" className="underline underline-offset-4 hover:text-gray-900">
                        conditions d&apos;utilisation
                    </Link>.
                </p>
            </div>
        </div>
    );
}
