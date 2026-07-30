import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/AdminDashboard';
import Home from '../pages/Home';
import TreatmentsList from '../pages/TreatmentsList';
import SkinTreatment from '../pages/SkinTreatment';
import BeforeAfterPage from '../pages/BeforeAfterPage';
import PricingPage from '../pages/PricingPage';
import Confirmation from '../pages/Confirmation';
import OffersPage from '../pages/OffersPage';
import ScrollToTop from '../components/common/ScrollToTop';
import Header from '../components/common/Header';

import ClinicGallery from '../components/ui/ClinicGallery';

const AppRouter = () => {
    return (
        <>
            <ScrollToTop />
            <Header />
            <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/treatments" element={<TreatmentsList />} />
                <Route path="/treatment/:id" element={<SkinTreatment />} />
                <Route path="/results" element={<BeforeAfterPage />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/gallery" element={<ClinicGallery />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/about" element={<div className="p-20 text-center text-2xl mt-32">About Page (Coming Soon)</div>} />
                <Route path="/ai-analysis" element={<div className="p-20 text-center text-2xl mt-32">AI Skin Analysis (Coming Soon)</div>} />
                <Route path="/contact" element={<div className="p-20 text-center text-2xl mt-32">Contact Page (Coming Soon)</div>} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
                {/* <Route path="/login" element={<Login />} /> */}
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
            </Route>
        </Routes>
        </>
    );
};

export default AppRouter;
