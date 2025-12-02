const AuthLayout = ({ title, subtitle, children, visualContent }) => (
    <div className="w-full max-w-[1920px] mx-auto border-x border-zinc-800 min-h-[calc(100vh-80px)] grid grid-cols-12">
        {/* Form Section */}
        <div className="col-span-12 lg:col-span-5 bg-zinc-950 border-r border-zinc-800 p-8 md:p-16 flex flex-col justify-center relative">
            {/* Decorative Corner */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-lime-400"></div>

            <div className="mb-12">
                <span className="font-mono text-lime-400 text-xs tracking-widest mb-2 block">{'/// SECURITY_GATEWAY_V1'}</span>
                <h1 className="font-sans font-bold text-5xl md:text-6xl text-white uppercase leading-[0.9] tracking-tighter mb-4">{title}</h1>
                <p className="font-mono text-xs text-zinc-500 max-w-sm">{subtitle}</p>
            </div>

            <div className="space-y-6">
                {children}
            </div>
        </div>

        {/* Visual/Art Section */}
        <div className="hidden lg:flex col-span-7 bg-zinc-900 relative overflow-hidden items-center justify-center">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(132,204,22,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(132,204,22,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Central Visual */}
            <div className="relative z-10 w-full h-full p-24 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="font-mono text-xs text-zinc-500">ENCRYPTION: AES-256<br />STATUS: SECURE</div>
                    <div className="w-16 h-16 border border-zinc-700 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                        <div className="w-12 h-12 border border-zinc-800 border-t-lime-400 rounded-full"></div>
                    </div>
                </div>

                {visualContent}

                <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest text-right">
                    Unauthorized access<br />will be logged
                </div>
            </div>
        </div>
    </div>
);

export default AuthLayout;