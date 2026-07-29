import React from 'react';
import GlossyButton from './GlossyButton';
import { useNavigate } from 'react-router-dom';

export default function ThankYouCard({ onOpenContact }: { onOpenContact?: () => void }) {
  return (
    <div className="grain relative overflow-hidden bg-[#07060a] text-neutral-200 flex items-center justify-center px-6 py-20">
      {/* Ambient gold glow behind card */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,180,107,0.10),transparent_65%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-60 w-[60%] -translate-x-1/2 rounded-full bg-gold-500/15 blur-3xl" />
      {/* Card */}
      <div className="relative w-full max-w-[900px]">
        <div className="relative overflow-hidden rounded-sm border border-gold-500/25 bg-gradient-to-b from-[#11101a]/80 to-[#07060a]/90 p-12 md:p-20 gold-glow">
          {/* Shimmer accent */}
          <div className="pointer-events-none absolute inset-0 shimmer opacity-40" />
          {/* Floating gold star */}
          <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-[60%] -translate-x-1/2 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="relative text-center">
            {/* Decorative divider */}
            <div className="mx-auto mb-10 flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/60" />
              <span className="text-gold-500 floaty">✦</span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/60" />
            </div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.45em] text-[#d4b46b] font-sans">
              A Note From Us
            </p>
            <h2 className="font-sans text-4xl leading-[1.05] text-neutral-50 md:text-6xl lg:text-7xl">
              Thank You for{" "}
              <span className="italic text-gold-gradient font-serif">Visiting</span>
            </h2>
            <p className="mx-auto mt-8 max-w-xl font-sans text-xl italic text-neutral-400 md:text-2xl">
              "Your presence defines our purpose. Connect with us to begin
              your journey."
            </p>
            <div className="mt-14">
              <GlossyButton onClick={onOpenContact}>
                Contact Us
                <span className="text-lg ml-2">→</span>
              </GlossyButton>
            </div>
            <div className="mt-12 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-sans">
              <span className="h-px w-10 bg-gold-500/30" />
              Panipat · Karnal
              <span className="h-px w-10 bg-gold-500/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
