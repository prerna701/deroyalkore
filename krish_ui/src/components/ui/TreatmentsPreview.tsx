import React from 'react';
import { treatmentsData } from '../../data/treatmentsData';
import GlossyButton from './GlossyButton';

interface TreatmentsPreviewProps {
    onSelect: (id: string) => void;
    onViewAll: () => void;
}

const TreatmentsPreview: React.FC<TreatmentsPreviewProps> = ({ onSelect, onViewAll }) => {
    // Convert to array and filter out any potential nulls
    const treatments = Object.values(treatmentsData || {}).filter(t => t && t.id);

    return (
        <section className="relative overflow-hidden bg-[#050403] py-28">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(212,175,55,0.16),transparent_24%),radial-gradient(circle_at_82%_78%,rgba(125,78,24,0.24),transparent_30%),linear-gradient(180deg,#050403_0%,#0b0704_52%,#050403_100%)]" />
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(120deg,rgba(255,214,106,0.08)_0_1px,transparent_1px_32px)]" />
            <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 md:px-10 relative z-10">
                {/* Section Header */}
                <div className="mx-auto mb-20 max-w-4xl text-center space-y-5">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/45"></div>
                        <span className="text-primary tracking-[0.65em] uppercase text-[10px] font-bold">The Collection</span>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/45"></div>
                    </div>
                    <h2 className="font-sans text-5xl md:text-7xl font-semibold text-white tracking-normal leading-none">
                        Signature <span className="text-primary italic">Treatments</span>
                    </h2>
                    <p className="text-white/55 text-[11px] md:text-sm tracking-[0.22em] md:tracking-[0.3em] max-w-2xl mx-auto uppercase leading-7">
                        A clinical gallery of cellular rejuvenation Rituals
                    </p>
                </div>

                {/* Treatment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 md:gap-8 2xl:gap-10">
                    {treatments.map((treatment) => (
                        <div
                            key={treatment.id}
                            onClick={() => onSelect(treatment.id)}
                            className="group flex cursor-pointer flex-col gap-5"
                        >
                            {/* Heading - Outside and Top */}
                            <h4 className="min-h-[3.5rem] text-center font-sans text-2xl font-semibold leading-tight text-white/90 transition-colors duration-500 group-hover:text-primary 2xl:text-3xl">
                                {treatment.title}
                            </h4>

                            {/* Inner Image Container with Border */}
                            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-primary/20 bg-[#090704] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.38)] transition-all duration-700 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-[0_30px_85px_rgba(212,175,55,0.16)]">
                                <div className="absolute inset-2 z-10 rounded-lg border border-primary/10 pointer-events-none" />
                                <img
                                    src={treatment.image}
                                    alt={treatment.title}
                                    className="h-full w-full rounded-lg object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-2 z-40 flex items-end justify-center rounded-lg bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                    <GlossyButton className="!px-5 !py-2.5 !text-[10px] translate-y-4 group-hover:translate-y-0 shadow-[0_0_30px_rgba(212,175,55,0.28)]">
                                        Explore Ritual
                                    </GlossyButton>
                                </div>

                                {/* Subtle inner shadow for depth */}
                                <div className="absolute inset-2 rounded-lg shadow-[inset_0_0_46px_rgba(0,0,0,0.58)] pointer-events-none"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-20 flex justify-center relative z-50">
                    <GlossyButton onClick={onViewAll}>
                        VIEW ALL RITUALS
                    </GlossyButton>
                </div>
            </div>
        </section>
    );
};

export default TreatmentsPreview;
