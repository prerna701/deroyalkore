import { lazy, Suspense, useCallback } from 'react';
import Hero from '../components/ui/Hero';
import AboutUsSection from '../components/ui/AboutUsSection';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import LoadingFallback from '../components/common/LoadingFallback';

const BeforeAfter = lazy(() => import('../components/ui/BeforeAfter'));
const ClinicGallery = lazy(() => import('../components/ui/ClinicGallery'));
const TestimonialsSection = lazy(() => import('../components/ui/TestimonialsSection'));
const TreatmentsPreview = lazy(() => import('../components/ui/TreatmentsPreview'));

const Home: React.FC = () => {
    const navigate = useNavigate();
    const navigateToResults = useCallback(() => navigate('/results'), [navigate]);
    const navigateToTreatments = useCallback(() => navigate('/treatments'), [navigate]);
    const navigateToTreatment = useCallback((id: string) => navigate(`/treatment/${id}`), [navigate]);

    useSEO({
        title: 'Home',
        description: 'Top-Rated Skin Clinic in Panipat, Karnal led by Dr. Manpreet Kaur.'
    });

    return (
        <>
            <Hero />
            <AboutUsSection />
            <Suspense fallback={<LoadingFallback label="Loading section..." minHeightClassName="min-h-0" />}>
                <TreatmentsPreview
                    onSelect={navigateToTreatment}
                    onViewAll={navigateToTreatments}
                />
                <BeforeAfter onViewAll={navigateToResults} />
                <ClinicGallery />
                <TestimonialsSection />
            </Suspense>
        </>
    );
};

export default Home;
