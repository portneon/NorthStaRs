import React from 'react';
import Link from 'next/link';

const CompletionModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0a0a0a] border border-[#CCFF00] p-1 shadow-[0_0_50px_rgba(204,255,0,0.2)] max-w-md w-full relative overflow-hidden group">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>

                <div className="bg-[#080808] p-8 relative z-10 flex flex-col items-center text-center">

                    {/* Icon */}
                    <div className="w-16 h-16 border border-[#CCFF00] flex items-center justify-center bg-[#CCFF00]/10 mb-6 rounded-full animate-pulse">
                        <span className="text-3xl">✅</span>
                    </div>

                    <h2 className="text-[#CCFF00] text-2xl font-bold uppercase tracking-widest mb-2">
                        MISSION_ACCOMPLISHED
                    </h2>

                    <div className="w-full h-[1px] bg-[#333333] my-4"></div>

                    <p className="text-[#B8B8B8] font-mono text-sm mb-8 leading-relaxed">
                        Protocol verified successfully. System integrity restored.
                        <br />
                        Ready for next assignment?
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <Link
                            href="/arena"
                            className="w-full py-3 bg-[#CCFF00] text-black font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                            <span>Return_To_Arena</span>
                            <span>→</span>
                        </Link>

                        <button
                            onClick={onClose}
                            className="w-full py-3 border border-[#333333] text-[#555555] font-bold text-sm uppercase tracking-widest hover:border-[#555] hover:text-[#B8B8B8] transition-colors"
                        >
                            Stay_Here
                        </button>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#CCFF00]"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#CCFF00]"></div>
                </div>
            </div>
        </div>
    );
};

export default CompletionModal;
