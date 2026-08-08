import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import GlossyButton from '../components/ui/GlossyButton';
import { useTreatments } from '../hooks/useTreatments';
import { resolveImageUrl } from '../utils/resolveImageUrl';

const OffersPage: React.FC = () => {
    const navigate = useNavigate();
    const { treatments, loading } = useTreatments();

    useSEO({
        title: 'Exclusive Offers',
        description: 'Special seasonal offers on our premium treatments.'
    });

    const discountedTreatments = treatments.filter(t => t.discountPrice);

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 text-center mb-16">
                <h1 className="font-sans text-5xl md:text-6xl font-bold text-[#3A2D23] mb-4">
                    Exclusive Offers
                </h1>
                <p className="font-sans text-xl md:text-2xl italic text-[#8B7A66] max-w-3xl mx-auto">
                    Limited time aesthetic and wellness packages curated just for you.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-10">Loading offers...</div>
            ) : discountedTreatments.length === 0 ? (
                <div className="text-center py-20 text-[#8B7A66] text-xl font-medium">
                    No active offers right now. Check back soon!
                </div>
            ) : (
                <div className="max-w-5xl mx-auto px-6 md:px-10 space-y-12">
                    {discountedTreatments.map((treatment) => (
                        <div key={treatment._id} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F2E9D8] via-[#EADBCA] to-[#D9A577] shadow-2xl border border-[#D9A577]/30">
                            
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#3A2D23]/5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3"></div>

                            <div className="flex flex-col lg:flex-row relative z-10">
                                {/* Image Section */}
                                <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-full">
                                    <img 
                                        src={resolveImageUrl(treatment.image) || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"}
                                        alt={treatment.title}
                                        className="absolute inset-0 w-full h-full object-cover rounded-t-[2rem] lg:rounded-l-[2rem] lg:rounded-tr-none"
                                    />
                                    {/* Overlay Badge */}
                                    <div className="absolute top-6 left-6 bg-[#3A2D23] text-[#F2E9D8] text-xs font-bold uppercase tracking-widest py-2 px-4 rounded-full shadow-lg">
                                        Limited Time
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
                                    <div className="mb-6">
                                        <h4 className="text-[#3A2D23] text-sm font-bold uppercase tracking-[0.3em] mb-2">Signature Treatment</h4>
                                        <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold text-[#3A2D23] leading-tight">
                                            {treatment.title}
                                        </h2>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start">
                                            <span className="material-symbols-outlined text-[#3A2D23] mr-3 mt-1">check_circle</span>
                                            <p className="font-sans text-lg text-[#5D4634] font-medium">
                                                Full Treatment for just <span className="font-bold text-[#3A2D23] text-xl border-b-2 border-[#3A2D23]">${treatment.discountPrice}</span> 
                                                <span className="line-through text-sm opacity-60 ml-3">${treatment.price}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="material-symbols-outlined text-[#3A2D23] mr-3 mt-1">schedule</span>
                                            <p className="font-sans text-lg text-[#5D4634] font-medium">Duration: <span className="font-bold text-[#3A2D23]">{treatment.duration}</span></p>
                                        </div>
                                    </div>

                                    <p className="font-sans text-xl italic text-[#5D4634] mb-10 leading-relaxed line-clamp-3">
                                        {treatment.about}
                                    </p>

                                    <GlossyButton onClick={() => navigate(`/treatment/${treatment.slug || treatment._id}`)}>
                                        Book Now
                                    </GlossyButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OffersPage;
