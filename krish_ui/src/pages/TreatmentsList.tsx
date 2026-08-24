import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTreatments } from '../hooks/useTreatments';
import { useSEO } from '../hooks/useSEO';
import { resolveImageUrl } from '../utils/resolveImageUrl';

const TreatmentsList: React.FC = () => {
    const navigate = useNavigate();
    const { treatments, loading } = useTreatments();
    const openTreatment = useCallback(
        (treatmentId: string) => navigate(`/treatment/${treatmentId}`),
        [navigate],
    );

    useSEO({
        title: 'Premium Treatments',
        description: 'Explore our comprehensive range of luxury skin and body treatments.'
    });

    if (loading) {
        return <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-90px)] bg-[#FDFBF7] flex justify-center items-center text-xl text-[#3A2D23]">Loading treatments...</div>;
    }

    return (
        <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-90px)] bg-[#FDFBF7] pt-8 pb-10">
            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 mb-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center cursor-pointer text-[#8B7A66] hover:text-[#5D4634] transition-colors font-sans text-sm tracking-widest uppercase font-bold"
                >
                    <span className="material-symbols-outlined mr-2 text-lg">arrow_back</span>
                    Back to Home
                </button>
            </div>

            {/* Header Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 text-center mb-6">
                <h1 className="font-sans text-5xl md:text-6xl font-bold text-[#3A2D23] mb-2">
                    Our Treatments
                </h1>
                <p className="font-sans text-xl md:text-2xl italic text-[#8B7A66] max-w-3xl mx-auto">
                    Advanced dermatological care blended with a luxurious experience. Discover the perfect ritual for your skin.
                </p>
            </div>

            {/* Grid Gallery */}
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {treatments.map((treatment) => (
                        <div
                            key={treatment._id || treatment.id || treatment.slug}
                            onClick={() => openTreatment(treatment.slug || treatment.id || treatment._id || '')}
                            className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg border border-[#E7D8BF] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <img
                                    src={resolveImageUrl(treatment.image)}
                                    alt={treatment.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0"></div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="font-sans text-xl font-bold text-[#3A2D23] mb-3 leading-snug">
                                    {treatment.title}
                                </h3>
                                <p className="font-sans text-sm text-[#5D4634] line-clamp-3 mb-6 flex-1 leading-relaxed">
                                    {treatment.about}
                                </p>
                                
                                <div className="flex items-center justify-between border-t border-[#F2E9D8] pt-4 mt-auto">
                                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#D9A577]">
                                        View Details
                                    </span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F3EA] text-[#D9A577] transition-all group-hover:bg-[#D9A577] group-hover:text-white">
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TreatmentsList;
