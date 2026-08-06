import React from 'react';
import AboutUsSection from '../components/ui/AboutUsSection';
import { useSEO } from '../hooks/useSEO';

const AboutPage: React.FC = () => {
    useSEO({
        title: 'About Us',
        description: 'Learn more about Krishi Skin Clinic and our advanced dermatological treatments.'
    });

    return (
        <div className="min-h-screen">
            <AboutUsSection hideButton={true} />
        </div>
    );
};

export default AboutPage;
