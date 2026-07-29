import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/ui/Footer';
import ContactOverlay from '../components/ui/ContactOverlay';
import FAQSection from '../components/ui/FAQSection';

import ThankYouCard from '../components/ui/ThankYouCard';

const MainLayout: React.FC = () => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <div className="bg-gradient-to-b from-[#FDFBF7] to-[#F2E9D8] selection:bg-primary/30 selection:text-white min-h-screen flex flex-col text-[#3A2D23]">
            <main className="flex-1">
                <Outlet />
            </main>
            <FAQSection />
            <ThankYouCard onOpenContact={() => setIsContactOpen(true)} />
            <Footer />
            <ContactOverlay isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </div>
    );
};

export default MainLayout;
