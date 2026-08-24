import React, { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { useBeforeAfterCases } from '../hooks/useBeforeAfterCases';
import { useTreatments } from '../hooks/useTreatments';
import GlossyButton from '../components/ui/GlossyButton';

const BeforeAfterPage: React.FC = memo(() => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<string>('all');
    const { cases, loading } = useBeforeAfterCases();
    const { treatments, getTreatmentName } = useTreatments();
    const [selectedTreatment, setSelectedTreatment] = useState<string>('');

    const handleBack = useCallback(() => navigate(-1), [navigate]);
    const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    }, []);
    const handleBook = useCallback(() => {
        if (selectedTreatment) {
            navigate(`/treatment/${selectedTreatment}`);
        } else {
            navigate('/treatments');
        }
    }, [selectedTreatment, navigate]);

    useSEO({
        title: 'Clinical Transformations - Real Results',
        description: 'Explore real skin transformation results from De Royal Kore Clinic, categorized by treatment type.'
    });

    // Group cases by treatment
    const groupedCases = useMemo(() => {
        const grouped: Record<string, typeof cases> = {};

        cases.forEach((item) => {
            const treatmentName = getTreatmentName(item.treatmentIds);
            if (!grouped[treatmentName]) {
                grouped[treatmentName] = [];
            }
            grouped[treatmentName].push(item);
        });

        return Object.entries(grouped).map(([category, items]) => ({ category, items }));
    }, [cases, getTreatmentName]);

    const displayedData = useMemo(() => {
        if (filter === 'all') return groupedCases;
        return groupedCases.filter((group) => group.category === filter);
    }, [filter, groupedCases]);

    return (
        <section className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-90px)] bg-[#f8f2ea] pt-8 pb-10 selection:bg-primary/30">
            <div className="mx-auto max-w-7xl px-6">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="group flex items-center gap-2 text-[#3A2D23] transition-all hover:text-primary"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
                    </button>
                </div>
                <div className="mb-8 space-y-6 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-primary/20"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-primary">The Evidence</span>
                        <div className="h-px w-12 bg-primary/20"></div>
                    </div>
                    <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#1a1a1a] md:text-7xl">
                        Real Skin <span className="italic text-primary">Transformations</span>
                    </h1>

                    <div className="flex flex-col items-center gap-4 pt-8">
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#1a1a1a]/40">Filter by Treatment</p>
                        <div className="relative inline-block w-full max-w-xs">
                            <select
                                value={filter}
                                onChange={handleFilterChange}
                                className="w-full appearance-none rounded-2xl border-2 border-primary/20 bg-white px-6 py-4 text-sm font-bold text-[#1a1a1a] shadow-lg transition-all focus:border-primary focus:outline-none"
                            >
                                <option value="all">View All Results</option>
                                {treatments.map((t: any) => (
                                    <option key={t.id || t._id} value={t.title || t.name || t.id || t._id}>
                                        {t.title || t.name || t.id || t._id}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-primary">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-16">
                    {loading ? (
                        <div className="rounded-[2rem] border border-primary/10 bg-white/80 px-8 py-16 text-center text-[#555]">
                            Loading results...
                        </div>
                    ) : displayedData.length === 0 ? (
                        <div className="rounded-[2rem] border border-primary/10 bg-white/80 px-8 py-16 text-center text-[#555]">
                            No results available yet.
                        </div>
                    ) : (
                        displayedData.map((group) => (
                            <div key={group.category} className="animate-fade-in-up delay-100">
                                <div className="mb-8 flex items-center gap-6">
                                    <h2 className="whitespace-nowrap text-2xl font-bold tracking-tight text-[#1a1a1a] md:text-3xl">
                                        {group.category}
                                    </h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent"></div>
                                    <span className="hidden text-[10px] font-bold uppercase tracking-[0.3em] text-primary sm:block">
                                        {group.items.length} Cases Documented
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {group.items.map((item, idx) => (
                                        <div
                                            key={item._id || `${item.label}-${idx}`}
                                            className="group rounded-[2.2rem] border border-primary/10 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] transition-all duration-700 hover:border-primary/40 hover:shadow-[0_30px_80px_rgba(211,161,33,0.1)]"
                                        >
                                            <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/70 transition-colors group-hover:text-primary">
                                                {item.label}
                                            </p>

                                            <div className="flex gap-2">
                                                <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl">
                                                    <img
                                                        src={item.before}
                                                        alt={`${item.label} before`}
                                                        className="h-full w-full object-cover grayscale-[30%] transition-all duration-500 group-hover:grayscale-0"
                                                    />
                                                    <div className="absolute left-3 top-3 rounded-md bg-black/50 px-2 py-1 backdrop-blur-md">
                                                        <span className="text-[7px] font-bold uppercase tracking-widest text-white">Before</span>
                                                    </div>
                                                </div>

                                                <div className="my-4 w-px bg-primary/10"></div>

                                                <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl">
                                                    <img
                                                        src={item.after}
                                                        alt={`${item.label} after`}
                                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                    <div className="absolute right-3 top-3 rounded-md bg-primary px-2 py-1 shadow-md">
                                                        <span className="text-[7px] font-bold uppercase tracking-widest text-black">After</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mx-auto mt-20 max-w-4xl overflow-hidden rounded-[3rem] border border-white/5 bg-[#1d1915] p-10 md:p-16 text-center relative">
                    <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/5 blur-3xl"></div>
                    <span className="material-symbols-outlined mb-6 text-4xl text-primary">workspace_premium</span>
                    <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">Your Skin is Next</h3>
                    <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-white/40 italic">
                        "Real beauty is a science. Every transformation documented here is a result of precise clinical methodology and skin dedication."
                    </p>
                    
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
                        <select
                            value={selectedTreatment}
                            onChange={(e) => setSelectedTreatment(e.target.value)}
                            className="w-full sm:w-2/3 rounded-xl border border-primary/20 bg-white/10 px-4 py-3.5 text-sm font-bold text-white shadow-lg backdrop-blur-md outline-none focus:border-primary"
                        >
                            <option value="" className="bg-[#1d1915] text-white">Select a Treatment...</option>
                            {treatments.map((t: any) => (
                                <option key={t._id || t.slug} value={t.slug || t._id} className="bg-[#1d1915] text-white">
                                    {t.title}
                                </option>
                            ))}
                        </select>
                        <GlossyButton onClick={handleBook} className="w-full sm:w-auto">
                            Book Appointment
                        </GlossyButton>
                    </div>
                </div>
            </div>
        </section>
    );
});

BeforeAfterPage.displayName = 'BeforeAfterPage';

export default BeforeAfterPage;
