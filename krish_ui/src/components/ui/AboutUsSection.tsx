import React, { memo, useEffect, useState } from 'react';
import { UI_STRINGS } from '../../constants/uiContent';
import GlossyButton from './GlossyButton';
import { apiClient } from '../../services/apiClient';
import type { SiteAbout } from '../../types';
import { useNavigate } from 'react-router-dom';

const AboutUsSection: React.FC<{ hideButton?: boolean }> = memo(({ hideButton = false }) => {
    const navigate = useNavigate();
    const { aboutSection } = UI_STRINGS;
    const [content, setContent] = useState<SiteAbout | null>(null);

    useEffect(() => {
        let isMounted = true;

        apiClient.getAboutSections()
            .then((records) => {
                if (isMounted && Array.isArray(records) && records[0]) {
                    setContent(records[0]);
                }
            })
            .catch(() => {
                if (isMounted) setContent(null);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const activeContent = content || aboutSection;

    return (
        <section className="bg-gradient-to-br from-[#F2E9D8] via-[#EADBCA] to-[#D9A577] py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-20">

                {/* Right Side: Text Content */}
                <div className="w-full lg:w-1/2 space-y-10 animate-fade-in-right">
                    <div className="space-y-3">
                        <span className="text-primary text-xs font-bold uppercase tracking-[4px] block">
                            {activeContent.tagline}
                        </span>
                        <h2 className="text-slate-950 text-4xl md:text-6xl font-bold leading-tight relative">
                            {activeContent.titlePrefix} <br />
                            <span className="text-primary italic">{activeContent.titleSuffix}</span>
                            {/* Golden Underline Accent */}
                            <span className="block w-24 h-1 bg-primary mt-6 rounded-full"></span>
                        </h2>
                    </div>

                    <div className="text-gray-700 text-base md:text-lg space-y-6 leading-relaxed font-light">
                        {activeContent.paragraphs.map((para, idx) => (
                            <p key={idx}>{para}</p>
                        ))}
                    </div>

                    {/* Premium Button */}
                    {!hideButton && (
                        <GlossyButton className="text-xs" onClick={() => navigate('/about')}>
                            {activeContent.buttonText}
                        </GlossyButton>
                    )}
                </div>

                {/* Left Side: Image Grid with Experience Badge */}
                <div className="w-full lg:w-1/2 relative animate-fade-in-left">
                    <div className="grid grid-cols-2 gap-4 md:gap-8 relative">

                        {/* Image 1 - Top Left */}
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transform hover:-rotate-2 transition-all duration-700 border-4 border-white/50">
                            <img
                                src={activeContent.images[0] || aboutSection.images[0]}
                                alt="Clinic Treatment"
                                className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 hover:scale-110 transition-all duration-1000"
                            />
                        </div>

                        {/* Image 2 - Top Right */}
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transform translate-y-12 hover:rotate-2 transition-all duration-700 border-4 border-white/50">
                            <img
                                src={activeContent.images[1] || aboutSection.images[1]}
                                alt="Patient Care"
                                className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 hover:scale-110 transition-all duration-1000"
                            />
                        </div>

                        {/* Image 3 - Bottom Left */}
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transform hover:rotate-2 transition-all duration-700 border-4 border-white/50">
                            <img
                                src={activeContent.images[2] || aboutSection.images[2]}
                                alt="Laser Technology"
                                className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 hover:scale-110 transition-all duration-1000"
                            />
                        </div>

                        {/* Image 4 - Bottom Right */}
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transform translate-y-12 hover:-rotate-2 transition-all duration-700 border-4 border-white/50">
                            <img
                                src={activeContent.images[3] || aboutSection.images[3]}
                                alt="Dermatology Consultation"
                                className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 hover:scale-110 transition-all duration-1000"
                            />
                        </div>

                        {/* Experience Badge */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 md:w-52 md:h-52 bg-slate-950 rounded-full border-[6px] border-cream flex flex-col items-center justify-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-50">
                            <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping"></div>
                            <span className="text-primary text-4xl md:text-6xl font-bold relative z-10">{activeContent.badge}</span>
                            <span className="text-cream text-[9px] md:text-[11px] uppercase tracking-[3px] font-bold relative z-10 leading-tight">
                                {activeContent.badgeLabel}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
});

AboutUsSection.displayName = "AboutUsSection";

export default AboutUsSection;
