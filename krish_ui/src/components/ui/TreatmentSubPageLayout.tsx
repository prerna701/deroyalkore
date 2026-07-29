import React, { memo, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { treatmentsData } from '../../data/treatmentsData';

interface TreatmentSubPageLayoutProps {
    title: string;
    subtitle: string;
    description: string;
    seoTitle?: string;
    seoDescription?: string;
    children: React.ReactNode;
    ctaText?: string;
    onCtaClick?: () => void;
}

const TreatmentSubPageLayout: React.FC<TreatmentSubPageLayoutProps> = memo(({
    title,
    subtitle,
    description,
    seoTitle,
    seoDescription,
    children,
    ctaText = "Reserve This Treatment",
    onCtaClick
}) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Memoize treatment lookup
    const treatment = useMemo(() => (id ? treatmentsData[id] : null), [id]);

    useSEO({
        title: seoTitle || `${treatment?.title} - ${title}`,
        description: seoDescription || description
    });

    // Memoize CTA handler
    const handleDefaultCta = useCallback(() => {
        if (onCtaClick) onCtaClick();
        else navigate(`/treatment/${id}`);
    }, [onCtaClick, navigate, id]);

    // Memoize Back button handler
    const handleBack = useCallback(() => {
        navigate(`/treatment/${id}`);
    }, [navigate, id]);

    if (!treatment) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-background-dark">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Ritual Not Found</h2>
                    <button onClick={() => navigate('/treatments')} className="text-primary uppercase tracking-widest text-xs font-bold hover:underline">
                        Return to Rituals
                    </button>
                </div>
            </div>
        );
    }

    return (
       <section
  className="bg-gradient-to-br from-[#F2E9D8] via-[#EADBCA] to-[#D9A577] py-16 px-6"
>
            {/* Standardized Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark h-16 flex items-center px-6 border-b border-white/5 shadow-2xl backdrop-blur-md bg-opacity-95">
                <button
                    onClick={handleBack}
                    className="text-white flex items-center gap-2 hover:text-primary transition-all group"
                >
                    <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Return to {treatment.title}</span>
                </button>
            </header>

            <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
                {/* Standardized Header Section */}
                <div className="text-center mb-16 space-y-6 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-primary/20"></div>
                        <span className="text-primary tracking-[0.8em] uppercase text-[10px] font-bold">{subtitle}</span>
                        <div className="h-px w-12 bg-primary/20"></div>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold text-[#1a1a1a] tracking-tight leading-tight">
                        {title.split(' ').map((word, i) => (
                            <span key={i} className={i === title.split(' ').length - 1 ? "text-primary italic" : ""}>
                                {word}{" "}
                            </span>
                        ))}
                    </h1>
                    <p className="text-[#1a1a1a]/60 text-sm md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed italic">
                        {description}
                    </p>
                </div>

                {/* Specific Page Content */}
                <div className="animate-fade-in-up delay-200">
                    {children}
                </div>

                {/* Standardized CTA */}
                <div className="mt-24 text-center animate-fade-in-up delay-500">
                    <button
                        onClick={handleDefaultCta}
                        className="btn-85 px-16 group"
                    >
                        <span>{ctaText}</span>
                        <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
                            {ctaText.toLowerCase().includes('book') || ctaText.toLowerCase().includes('reserve') ? 'calendar_month' : 'arrow_forward'}
                        </span>
                    </button>
                    <p className="mt-6 text-[#1a1a1a]/30 text-[10px] uppercase tracking-[0.4em] font-bold">
                        Professional Guidance • Clinical Excellence
                    </p>
                </div>
            </main>
        </section>
    );
});

TreatmentSubPageLayout.displayName = "TreatmentSubPageLayout";

export default TreatmentSubPageLayout;
