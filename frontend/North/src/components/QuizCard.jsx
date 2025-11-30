import React from 'react';
import { Trophy, Clock, Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const QuizCard = ({ quiz }) => {
  const difficultyColor = {
    easy: 'text-lime-400',
    medium: 'text-amber-400',
    hard: 'text-red-400',
    expert: 'text-purple-400'
  };

  return (
    <Link href={`/quiz/${quiz.id}`}>
      <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden h-full">
        {/* Decorative corner */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-lime-400/50"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header with difficulty and daily badge */}
          <div className="flex justify-between items-start mb-4">
            <span className={`font-mono text-xs px-3 py-1 rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/20`}>
              {quiz.difficulty?.toUpperCase() || 'QUIZ'}
            </span>
            {quiz.isDaily && (
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1.5">
                <Trophy size={12} /> DAILY
              </span>
            )}
          </div>

          {/* Quiz title and description */}
          <div className="flex-grow">
            <h3 className="font-sans font-bold text-xl text-white mb-3 group-hover:text-lime-400 transition-colors">
              {quiz.title}
            </h3>
            <p className="font-mono text-sm text-zinc-400 mb-6 line-clamp-2">
              {quiz.description || 'Test your knowledge with this quiz.'}
            </p>
          </div>

          {/* Footer with metadata */}
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 font-mono text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-lime-400/80" />
                  {quiz.questions?.length * 2 || 10}m
                </span>
                <span className="flex items-center gap-1.5">
                  <Brain size={14} className="text-lime-400/80" />
                  {quiz.questions?.length || 0} Qs
                </span>
              </div>
              <div className="flex items-center text-lime-400 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuizCard;
