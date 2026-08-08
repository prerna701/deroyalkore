import React from 'react';
import AboutUsSection from '../components/ui/AboutUsSection';
import { useSEO } from '../hooks/useSEO';

const AboutPage: React.FC = () => {
    useSEO({
        title: 'About Us',
        description: 'Learn more about Krishi Skin Clinic and our advanced dermatological treatments.'
    });

    return (
        <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-90px)] flex flex-col justify-center">
            <AboutUsSection hideButton={true} />
        </div>
    );
};

export default AboutPage;
