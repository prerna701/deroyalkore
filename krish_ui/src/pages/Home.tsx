import Hero from '../components/ui/Hero';
import TreatmentsPreview from '../components/ui/TreatmentsPreview';
import BeforeAfter from '../components/ui/BeforeAfter';
import AboutUsSection from '../components/ui/AboutUsSection';
import ClinicGallery from '../components/ui/ClinicGallery';
import TestimonialsSection from '../components/ui/TestimonialsSection';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const Home: React.FC = () => {
    const navigate = useNavigate();

    useSEO({
        title: 'Home',
        description: 'Top-Rated Skin Clinic in Panipat, Karnal led by Dr. Manpreet Kaur.'
    });

    return (
        <>
            <Hero />
            <AboutUsSection />
             <TreatmentsPreview
                onSelect={(id) => navigate(`/treatment/${id}`)}
                onViewAll={() => navigate('/treatments')}
            />
            <BeforeAfter onViewAll={() => navigate('/results')} />
            <ClinicGallery />
            <TestimonialsSection />
        </>
    );
};

export default Home;
