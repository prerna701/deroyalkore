import React, { memo } from 'react';
import { UI_STRINGS } from '../../constants/uiContent';

const ClinicGallery: React.FC = memo(() => {
    const { clinicGallery } = UI_STRINGS;

    return (
        <section
            className="bg-gradient-to-br from-[#F2E9D8] via-[#EADBCA] to-[#D9A577] min-h-[calc(100vh-90px)] py-8 px-6 flex flex-col justify-center w-full"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 space-y-2">
                    <span className="text-primary text-xs font-bold uppercase tracking-[5px] block animate-fade-in">
                        {clinicGallery.subtitle}
                    </span>
                    <h2 className="text-slate-950 text-3xl md:text-5xl font-bold tracking-tight">
                        {clinicGallery.title} <span className="text-primary italic">{clinicGallery.titleSuffix}</span>
                    </h2>
                    <div className="flex justify-center mt-6">
                        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
                    </div>
                </div>

                {/* Uniform Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {clinicGallery.images.map((img, idx) => (
                        <div
                            key={idx}
                            className="group relative rounded-[1.5rem] overflow-hidden shadow-xl hover:shadow-[0_30px_60px_rgba(211,175,55,0.2)] transition-all duration-700 hover:-translate-y-2 border border-primary/5 aspect-[4/3]"
                        >
                            <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                                <span className="text-primary text-[10px] font-bold uppercase tracking-[3px] mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    THE ROYAL CORE
                                </span>
                                <h3 className="text-white text-xl font-bold tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                                    {img.title}
                                </h3>

                                {/* Decorative Corner */}
                                <div className="absolute top-6 right-6 size-12 border-t-2 border-r-2 border-primary/40 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                            </div>

                            {/* Corner Badge */}
                            <div className="absolute bottom-6 right-6 size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <span className="material-symbols-outlined text-white text-lg">zoom_in</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA or Note */}
                <div className="mt-8 text-center flex-shrink-0">
                    <p className="text-gray-400 text-xs uppercase tracking-[4px] font-medium">
                        World-Class Infrastructure • Advanced Skin Technology • Luxury Care
                    </p>
                </div>
            </div>
        </section>
    );
});

ClinicGallery.displayName = "ClinicGallery";

export default ClinicGallery;
