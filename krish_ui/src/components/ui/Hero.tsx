import React from "react";
import heroVideo from "../../assets/processed_1784880738109-GpcEPHYY-0 (1).mp4.mp4";
import GlossyButton from "./GlossyButton";

const Hero: React.FC = () => {
    return (
        <section className="relative flex h-[calc(100vh-90px)] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#F2E9D8] via-[#EADBCA] to-[#D9A577] py-8 px-4 sm:px-6 lg:px-8">

            {/* Elegant Background Texture Overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-10 mix-blend-overlay">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <defs>
                        <pattern id="noise" width="400" height="400" patternUnits="userSpaceOnUse">
                            <rect width="400" height="400" fill="#fff" />
                            <filter id="noiseFilter">
                                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
                            </filter>
                            <rect width="400" height="400" filter="url(#noiseFilter)" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#noise)" />
                </svg>
            </div>

            <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">

                {/* Minimalist Branding */}
                <div className="mb-8 text-center animate-fade-in-up px-4">
                    <h1 className="font-sans mb-4 text-4xl italic font-bold tracking-[0.1em] text-[#3A2D23] sm:text-3xl md:text-4xl drop-shadow-sm max-w-4xl mx-auto leading-tight">
                        De ROYAL Kore <br></br>
                         Wholesale Market and treatment protocol center
                    </h1>
                    <p className="mt-4 font-sans text-lg italic tracking-widest text-[#5C4535] sm:text-xl drop-shadow-sm">
                        Solution for all types of skin problems
                    </p>
                </div>

                {/* Framed Video Container */}
                <div className="group relative w-full max-w-4xl mx-auto h-[35vh] sm:h-[40vh] md:h-[45vh] rounded-[32px] bg-[#F8F3EA] p-2 sm:p-3 shadow-[0_30px_60px_rgba(58,45,35,0.25)] ring-1 ring-white/60 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(58,45,35,0.35)] animate-fade-in-up delay-200 flex-shrink-0">

                    <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-black shadow-inner">
                        <video
                            src={heroVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />

                        {/* Overlay to ensure smooth transitions */}
                        <div className="pointer-events-none absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />

                        {/* Central Play Button on Hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                            <button className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-110 hover:bg-white/30 transition-all duration-300 focus:outline-none">
                                <span className="material-symbols-outlined ml-1 text-4xl text-white">
                                    play_arrow
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-4 sm:mt-8 animate-fade-in-up delay-300 flex-shrink-0">
                    <GlossyButton onClick={() => window.location.href = '/collection'}>
                        Discover
                    </GlossyButton>
                </div>

            </div>
        </section>
    );
};

export default Hero;
