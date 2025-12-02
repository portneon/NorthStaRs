import React from 'react'

function ModuleCard({ title, sub, progress, span, onClick }) {
  return (

    <div onClick={onClick} className={`${span} bg-zinc-950 border-r border-b border-zinc-800 p-6 md:p-8 group hover:bg-zinc-900 transition-all cursor-pointer relative min-h-[200px] flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-6 md:mb-12">
        <div className="w-2 h-2 bg-zinc-800 group-hover:bg-lime-400 transition-colors"></div>
        <span className="font-mono text-[10px] md:text-xs text-zinc-600 group-hover:text-zinc-400">{progress}% COMPLETE</span>
      </div>
      <div className="relative z-10">
        <span className="font-mono text-lime-400 text-[10px] md:text-xs uppercase tracking-wider mb-2 block">{sub}</span>
        <h3 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-zinc-100 uppercase leading-none group-hover:translate-x-2 transition-transform duration-300 wrap-break-words">
          {title}
        </h3>
      </div>
      <div className="absolute bottom-0 right-0 w-0 h-0 border-t-20 border-t-transparent border-r-20 border-r-lime-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );

}

export default ModuleCard