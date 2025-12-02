

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import InputField from '@/components/InputField';
import { login } from '@/app/utils/api';
import Link from 'next/link';
export default function LoginView() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(formData.email, formData.password);
            console.log('Login successful:', data);
            // Redirect to home page
            router.push('/');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Identify"
            subtitle="Enter your credentials to access the Neural Grid. Anonymity is not permitted in this sector."
            visualContent={
                <div className="text-center">
                    <div className="text-9xl font-bold text-zinc-800 font-sans tracking-tighter select-none">ACCESS</div>
                    <div className="text-lime-400 font-mono text-sm tracking-[1em] uppercase mt-4 animate-pulse">Awaiting_Key</div>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-950 border border-red-800 p-3 font-mono text-xs text-red-400">
                        ERROR: {error}
                    </div>
                )}

                <InputField
                    label="Operative_ID / Email"
                    name="email"
                    type="email"
                    placeholder="USR-2490..."
                    value={formData.email}
                    onChange={handleChange}
                />

                <InputField
                    label="Passcode"
                    name="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                />

                <div className="flex justify-between items-center mt-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="w-4 h-4 border border-zinc-700 bg-transparent checked:bg-lime-400 cursor-pointer"
                        />
                        <span className="font-mono text-xs text-zinc-500 uppercase">Keep_Session_Alive</span>
                    </label>
                    <Link href="/auth/forgot-password" className="font-mono text-xs text-zinc-500 hover:text-lime-400 uppercase border-b border-transparent hover:border-lime-400 transition-all">
                        Lost_Key?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-lime-400 text-black p-4 font-mono text-sm font-bold uppercase hover:bg-white transition-colors mt-4 flex justify-between items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span>{loading ? 'Connecting...' : 'Establish_Connection'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <p className="text-center font-mono text-xs text-zinc-600 mt-4">
                    No access credentials? <Link href="/auth/signup" className="text-lime-400 hover:underline">Initialize_Account</Link>
                </p>
            </form>
        </AuthLayout>
    );
}

// login