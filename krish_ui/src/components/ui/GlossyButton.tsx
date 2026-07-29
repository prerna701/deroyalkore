import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function GlossyButton({ children, className = "", onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full
        cursor-pointer
        min-h-[64px]
        px-12 py-5
        text-base md:text-lg
        bg-gradient-to-b from-[#3A2D23] via-[#1A120B] to-[#050403]
        font-semibold text-[#FDFBF7] tracking-wide uppercase
        shadow-[0_10px_30px_-6px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-3px_8px_rgba(0,0,0,0.6)]
        ring-1 ring-white/50
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:scale-[1.03]
        hover:shadow-[0_0_25px_rgba(255,255,255,0.3),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-3px_10px_rgba(0,0,0,0.7)]
        hover:ring-white/80
        active:translate-y-0.5
        active:scale-[0.98]
        active:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.6),inset_0_2px_6px_rgba(0,0,0,0.8)]
        focus:outline-none
        focus-visible:ring-4
        focus-visible:ring-white/50
        animate-[pulseGlow_3s_ease-in-out_infinite]
        ${className}`}
    >
      {/* animated gradient sheen layer (subtle gold/cream for the dark theme) */}
      <span className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,#3A2D23,#5C4535,#3A2D23,#1A120B,#3A2D23)] bg-[length:300%_100%] animate-[shift_6s_linear_infinite] opacity-50" />

      {/* top glass highlight */}
      <span className="pointer-events-none absolute inset-x-1 top-0.5 h-1/2 rounded-full bg-gradient-to-b from-white/20 to-transparent" />

      {/* travelling shine */}
      <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_3.2s_ease-in-out_infinite]" />

      <span className="relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {children}
        {/* Shiny white border under text */}
        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_rgba(255,255,255,0.9)] opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
      </span>
    </button>
  );
}