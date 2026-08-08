import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { useTreatments } from '../hooks/useTreatments';

const pricingData = [
  { treatment: 'Pigmentation & Melasma (Basic)', price: '₹3,500' },
  { treatment: 'Pigmentation & Melasma (Advance)', price: '₹10,000' },
  { treatment: 'Pigmentation & Melasma (Most Safe & Advanced)', price: '₹15,000' },
  { treatment: 'Whitening Treatment', price: '₹5,000' },
  { treatment: 'Advance Whitening', price: '₹10,000' },
  { treatment: 'Korean Glass Skin (Basic)', price: '₹3,500' },
  { treatment: 'Korean Glass Skin (Advance)', price: '₹10,000' },
  { treatment: 'Korean Glass Skin (Premium)', price: '₹15,000' },
  { treatment: 'Korean Glass Skin (Luxury)', price: '₹20,000' },
  { treatment: 'Acne Removal', price: '₹8,000' },
  { treatment: 'Open Pores (Per Sitting)', price: '₹2,000' },
  { treatment: 'Open Pores (6 Sittings)', price: '₹12,000' },
  { treatment: 'Uneven Skin Treatment', price: '₹3,000' },
  { treatment: 'Advance Uneven Skin Treatment', price: '₹5,000' },
  { treatment: 'Tanning Removal', price: '₹5,000' },
  { treatment: 'Body Pigmentation Removal', price: '₹12,000' },
  { treatment: 'Advance Body Pigmentation Removal', price: '₹20,000' },
  { treatment: 'Body Whitening & Glow', price: '₹12,000' },
  { treatment: 'Advance Body Whitening', price: '₹20,000' },
  { treatment: 'Intimate Area Whitening', price: '₹15,000' },
];

const PricingPage: React.FC = () => {
    useSEO({
        title: 'Treatment Pricing',
        description: 'Transparent pricing for all our premium skin clinic treatments.'
    });

    const { treatments, loading } = useTreatments();

    // Combine static pricing with dynamic treatments from Admin panel
    const dynamicPricing = treatments.map(t => ({
        treatment: t.title,
        price: String(t.price).startsWith('₹') ? t.price : `₹${t.price}`
    }));

    // Filter out dynamic treatments that might exactly match a static one to avoid exact duplicates
    const filteredDynamic = dynamicPricing.filter(dp => !pricingData.find(sp => sp.treatment === dp.treatment));
    
    const combinedPricing = [...filteredDynamic, ...pricingData];

    return (
        <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-90px)] bg-[#FDFBF7] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="font-sans text-4xl font-bold tracking-tight text-[#3A2D23] sm:text-5xl">
                        Investment in Your Skin
                    </h1>
                    <p className="mt-4 font-sans text-xl italic text-[#8B7A66]">
                        Transparent, premium pricing for world-class dermatological care.
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#E7D8BF] bg-white shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F2E9D8] border-b border-[#DDD0B8]">
                                <th className="px-8 py-5 text-sm font-bold uppercase tracking-widest text-[#5D4634]">Treatment</th>
                                <th className="px-8 py-5 text-sm font-bold uppercase tracking-widest text-[#5D4634] text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F2E9D8]">
                            {loading ? (
                                <tr>
                                    <td colSpan={2} className="px-8 py-10 text-center text-[#5D4634]">Loading current pricing...</td>
                                </tr>
                            ) : (
                                combinedPricing.map((item, index) => (
                                    <tr key={index} className="transition-colors hover:bg-[#F8F1E6]/50">
                                        <td className="px-8 py-5 font-sans text-[15px] text-[#5D4634]">{item.treatment}</td>
                                        <td className="px-8 py-5 font-sans text-lg font-semibold text-[#8A6423] text-right">{item.price}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[#8B7A66] mb-6">Ready to start your journey to flawless skin?</p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-full bg-[#3A2D23] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-[#F2E9D8] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#251D16] hover:shadow-xl"
                    >
                        Book an Appointment
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
