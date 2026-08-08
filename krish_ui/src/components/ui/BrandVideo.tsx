import React from "react";
import heroVideo from "../../assets/v1.mp4";

const BrandVideo: React.FC = () => {
    return (
        <section id="brand-video" className="relative z-20 bg-[#050403] px-6 py-20">

            <div className="max-w-[1200px] mx-auto flex justify-center">

                <div className="relative w-full max-w-5xl group">

                    <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-[#090704] p-3 shadow-[0_32px_90px_-35px_rgba(211,161,33,0.58)] transition-colors duration-700 hover:border-primary/75">

                        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-black">
                            <video
                                src={heroVideo}
                                controls
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover"
                            />

                            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-5 py-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.36em] text-primary">
                                    Brand film
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                                    De Royal Kore
                                </span>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-[0.8fr_1fr] md:items-end">
                        <h2 className="font-sans text-4xl leading-tight text-white md:text-6xl">
                            The De Royal Kore Journey
                        </h2>
                        <p className="max-w-2xl text-sm leading-7 text-white/60 md:text-base">
                            Discover the science and artistry behind our signature skin rituals, where modern innovation meets a calm gold-standard clinic experience.
                        </p>
                    </div>

                </div>

            </div>

        </section>
    );
};

export default BrandVideo;
