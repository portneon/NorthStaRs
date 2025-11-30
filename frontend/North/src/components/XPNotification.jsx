'use client';
import React, { useEffect, useState } from 'react';

const XPNotification = ({ amount, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 500); // Wait for exit animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-24 right-8 z-50 transition-all duration-500 ease-out transform ${visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <div className="flex items-center gap-4 bg-[#0a0a0a] border border-[#333333] pl-4 pr-8 py-4 shadow-2xl relative overflow-hidden group min-w-[240px]">

                {/* Accent Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.4)]"></div>

                {/* Icon / Graphic */}
                <div className="flex items-center justify-center w-10 h-10 bg-[#111] border border-[#333] rounded-sm">
                    <span className="text-[#CCFF00] text-lg">▲</span>
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-[#666] uppercase tracking-[0.2em] mb-1">
                        Experience_Update
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="font-sans font-bold text-3xl text-white tracking-tight leading-none">
                            +{amount}
                        </span>
                        <span className="font-mono text-xs text-[#CCFF00]">XP</span>
                    </div>
                </div>

                {/* Subtle Scanline */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none opacity-50"></div>

                {/* Progress Bar for Timer */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-[#333333] w-full">
                    <div className={`h-full bg-[#CCFF00] transition-all duration-[3000ms] ease-linear ${visible ? 'w-0' : 'w-full'}`}></div>
                </div>
            </div>
        </div>
    );
};

export default XPNotification;
