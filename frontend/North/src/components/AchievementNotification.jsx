import React, { useEffect, useState } from 'react';

const AchievementNotification = ({ achievement, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (achievement) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 500); // Wait for exit animation
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [achievement, onClose]);

    if (!achievement) return null;

    return (
        <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-[#0a0a0a] border border-[#CCFF00] p-1 shadow-[0_0_20px_rgba(204,255,0,0.2)] relative overflow-hidden group">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>

                <div className="bg-[#080808] p-4 flex items-center gap-4 relative z-10 min-w-[300px]">
                    {/* Icon Container */}
                    <div className="w-12 h-12 border border-[#333333] flex items-center justify-center bg-[#0a0a0a] group-hover:border-[#CCFF00] transition-colors relative">
                        <div className="absolute inset-0 bg-[#CCFF00] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <span className="text-2xl">{getIcon(achievement.icon)}</span>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] text-[#CCFF00] uppercase tracking-widest animate-pulse">
                                /// ACHIEVEMENT_UNLOCKED
                            </span>
                            <span className="text-[10px] text-[#555555] font-mono">
                                +{achievement.xpReward} XP
                            </span>
                        </div>
                        <h3 className="text-white font-bold uppercase tracking-wide text-sm mb-1 group-hover:text-[#CCFF00] transition-colors">
                            {achievement.name}
                        </h3>
                        <p className="text-[#888] text-xs font-mono leading-tight">
                            {achievement.description}
                        </p>
                    </div>

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#CCFF00]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#CCFF00]"></div>
                </div>
            </div>
        </div>
    );
};

// Helper to map icon names to emojis or SVGs
const getIcon = (iconName) => {
    const icons = {
        trophy: '🏆',
        award: '🎖️',
        crown: '👑',
        star: '⭐',
        flame: '🔥',
        zap: '⚡',
        code: '💻',
        bug: '🐛',
        rocket: '🚀'
    };
    return icons[iconName] || '🏆';
};

export default AchievementNotification;
