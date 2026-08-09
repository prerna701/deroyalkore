import React, { useMemo, useState } from 'react';
import GlossyButton from './GlossyButton';
import { useBeforeAfterCases } from '../../hooks/useBeforeAfterCases';
import { useTreatments } from '../../hooks/useTreatments';

interface BeforeAfterProps {
    onViewAll?: () => void;
    miniHeader?: boolean;
}

const BeforeAfter: React.FC<BeforeAfterProps> = ({ onViewAll, miniHeader }) => {
    const { cases, loading } = useBeforeAfterCases();
    const { treatments, getTreatmentName } = useTreatments();
    const [showAll, setShowAll] = useState(false);
    const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>('All');

    const filteredCases = useMemo(() => {
        if (selectedTreatmentId === 'All') return cases;
        return cases.filter((c) =>
            c.treatmentIds && c.treatmentIds.includes(selectedTreatmentId)
        );
    }, [cases, selectedTreatmentId]);

    const displayedCases = useMemo(() => {
        return showAll ? filteredCases : filteredCases.slice(0, 6);
    }, [filteredCases, showAll]);

    const handleViewAll = () => {
        if (onViewAll && !showAll) {
            onViewAll();
        }
        setShowAll(!showAll);
    };

    return (
        <section className={`w-full bg-gradient-to-br from-[#f4ebdf] via-[#e9d9c0] to-[#d8a87c] px-6 ${miniHeader ? 'py-8 min-h-[90vh] sm:min-h-screen flex flex-col justify-center' : 'py-16 sm:py-20 lg:py-24'}`}>
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
                {!miniHeader ? (
                    <div className="mb-10 max-w-2xl text-center">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#7a4b24]">Transformations</p>
                        <h2 className="text-3xl font-bold text-[#111111] sm:text-4xl">Before &amp; After results</h2>
                        <p className="mt-3 text-sm leading-7 text-[#4b4b4b] sm:text-base">
                            Browse real outcomes by treatment and explore how each case was documented.
                        </p>
                    </div>
                ) : (
                    <div className="mb-6 w-full text-center flex items-center justify-center gap-4">
                        <span className="h-px flex-1 max-w-[60px] bg-[#7a4b24]/30"></span>
                        <h2 className="text-lg sm:text-xl font-bold text-[#111111] uppercase tracking-[0.2em]">Transformations</h2>
                        <span className="h-px flex-1 max-w-[60px] bg-[#7a4b24]/30"></span>
                    </div>
                )}

                {treatments.length > 0 && (
                    <div className="mb-10 flex w-full max-w-xs flex-col items-center gap-3">
                        <label htmlFor="before-after-treatment" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7a4b24]">
                            Filter by Treatment
                        </label>
                        <div className="relative w-full">
                            <select
                                id="before-after-treatment"
                                value={selectedTreatmentId}
                                onChange={(event) => {
                                    setSelectedTreatmentId(event.target.value);
                                    setShowAll(false);
                                }}
                                className="w-full appearance-none rounded-2xl border border-[#111111]/10 bg-white px-5 py-3 pr-12 text-sm font-semibold text-[#111111] shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all focus:border-[#111111] focus:outline-none"
                            >
                                <option value="All">View All Results</option>
                                {treatments.map((t: any) => (
                                    <option key={t.id || t._id} value={t.id || t._id}>
                                        {t.title || t.name || t.id || t._id}
                                    </option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7a4b24]">
                                expand_more
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {loading ? (
                        <div className="col-span-full rounded-3xl border border-[#111111]/10 bg-white/70 px-8 py-12 text-center text-[#555]">
                            Loading results...
                        </div>
                    ) : filteredCases.length === 0 ? (
                        <div className="col-span-full rounded-3xl border border-[#111111]/10 bg-white/70 px-8 py-12 text-center text-[#555]">
                            No cases available for this treatment yet.
                        </div>
                    ) : (
                        displayedCases.map((c) => (
                            <article
                                key={c._id || c.label}
                                className="rounded-[28px] border border-[#111111]/10 bg-white p-4 shadow-[0_16px_50px_rgba(0,0,0,0.08)]"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a4b24]">
                                        {getTreatmentName(c.treatmentIds)}
                                    </span>
                                    <span className="rounded-full bg-[#f5e7d8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a4b24]">
                                        Featured
                                    </span>
                                </div>

                                <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#111111]">
                                    {c.label}
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="overflow-hidden rounded-2xl">
                                        <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a4b24]">
                                            Before
                                        </div>
                                        <img
                                            src={c.before}
                                            alt={`${c.label} before`}
                                            className="h-44 w-full object-cover"
                                        />
                                    </div>

                                    <div className="overflow-hidden rounded-2xl">
                                        <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a4b24]">
                                            After
                                        </div>
                                        <img
                                            src={c.after}
                                            alt={`${c.label} after`}
                                            className="h-44 w-full object-cover"
                                        />
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {filteredCases.length > 6 && (
                    <div className="mt-10 flex justify-center">
                        <GlossyButton onClick={handleViewAll}>
                            {showAll ? 'SHOW LESS' : 'VIEW ALL RESULTS'}
                        </GlossyButton>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BeforeAfter;
