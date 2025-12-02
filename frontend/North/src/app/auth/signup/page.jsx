'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import InputField from '@/components/InputField';
import { register } from '@/app/utils/api';
import Link from 'next/link';

export default function SignupView() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await register(formData.username, formData.email, formData.password);
            console.log('Registration successful:', data);
            // Redirect to home page
            router.push('/');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Initialize"
            subtitle="Create a new operative record. Your performance data will be tracked globally."
            visualContent={
                <div className="border border-zinc-700 p-8 relative">
                    <div className="absolute top-0 left-0 bg-lime-400 px-2 py-1 text-[10px] font-bold text-black font-mono">NEW_USER_PROTOCOL</div>
                    <div className="space-y-4 mt-4 font-mono text-xs text-zinc-500">
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>ALLOCATING_MEMORY...</span>
                            <span className="text-lime-400">OK</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>GENERATING_UUID...</span>
                            <span className="text-lime-400">OK</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                            <span>SYNCING_LEADERBOARD...</span>
                            <span className="text-lime-400">PENDING</span>
                        </div>
                    </div>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-950 border border-red-800 p-3 font-mono text-xs text-red-400">
                        ERROR: {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        label="First_Name"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Last_Name"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>

                <InputField
                    label="Choose_Operative_ID"
                    name="username"
                    placeholder="Neo_Walker_99"
                    value={formData.username}
                    onChange={handleChange}
                />

                <InputField
                    label="Email_Address"
                    name="email"
                    type="email"
                    placeholder="operative@nexus.grid"
                    value={formData.email}
                    onChange={handleChange}
                />

                <InputField
                    label="Set_Passcode"
                    name="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full border border-lime-400 text-lime-400 p-4 font-mono text-sm font-bold uppercase hover:bg-lime-400 hover:text-black transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Uploading_Manifest...' : 'Upload_Manifest'}
                </button>

                <p className="text-center font-mono text-[10px] text-zinc-600 mt-4">
                    By initializing, you agree to the <Link href="/terms" className="underline hover:text-lime-400">Grid_Protocols</Link>.
                </p>

                <p className="text-center font-mono text-xs text-zinc-600 mt-4">
                    Already have access? <Link href="/auth/login" className="text-lime-400 hover:underline">Establish_Connection</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
