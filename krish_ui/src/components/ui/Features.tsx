import React from 'react';

const Features: React.FC = () => {
    const features = [
        {
            icon: 'diamond',
            title: 'Rare Botanicals',
            description: 'Ethically sourced from the hidden valleys of the Alps.',
            tag: 'Sourcing'
        },
        {
            icon: 'architecture',
            title: 'Gold Infusion',
            description: 'Proprietary 24K colloidal gold suspension technology.',
            tag: 'Technology'
        },
        {
            icon: 'spa',
            title: 'The Ritual',
            description: 'A transformative daily meditative experience for the skin.',
            tag: 'Holistics'
        }
    ];

    return (
        <section className="py-20 bg-background-dark relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto px-10 relative z-10">
                <div className="flex flex-col items-center mb-12 text-center">
                    <span className="text-primary tracking-[0.6em] uppercase text-[10px] font-bold mb-4">Unrivaled Excellence</span>
                    <h3 className="text-3xl md:text-5xl font-light text-white tracking-wide">The Pillars of Aurum</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-700 hover:-translate-y-4"
                        >
                            <span className="inline-block text-[8px] tracking-[0.4em] uppercase text-primary/60 mb-8 border border-primary/20 px-3 py-1 rounded-full">
                                {feature.tag}
                            </span>
                            <div className="text-primary mb-8 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[10deg]">
                                <span className="material-symbols-outlined text-5xl font-extralight">{feature.icon}</span>
                            </div>
                            <h4 className="text-xl text-white mb-6 tracking-wide group-hover:text-primary transition-colors">
                                {feature.title}
                            </h4>
                            <p className="text-white/40 text-sm leading-relaxed tracking-wide group-hover:text-white/60 transition-colors">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
