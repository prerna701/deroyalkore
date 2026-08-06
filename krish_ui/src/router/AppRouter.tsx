import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { ReactNode } from 'react';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import ScrollToTop from '../components/common/ScrollToTop';
import Header from '../components/common/Header';
import LoadingFallback from '../components/common/LoadingFallback';

const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const BeforeAfterPage = lazy(() => import('../pages/BeforeAfterPage'));
const ClinicGallery = lazy(() => import('../components/ui/ClinicGallery'));
const Confirmation = lazy(() => import('../pages/Confirmation'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const Home = lazy(() => import('../pages/Home'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const OffersPage = lazy(() => import('../pages/OffersPage'));
const PricingPage = lazy(() => import('../pages/PricingPage'));
const SkinTreatment = lazy(() => import('../pages/SkinTreatment'));
const TreatmentsList = lazy(() => import('../pages/TreatmentsList'));

interface AppRoute {
    path: string;
    element: ReactNode;
}

const comingSoonPage = (title: string) => (
    <div className="p-20 text-center text-2xl mt-32">{title} (Coming Soon)</div>
);

const publicRoutes: AppRoute[] = [
    { path: '/', element: <Home /> },
    { path: '/treatments', element: <TreatmentsList /> },
    { path: '/treatment/:id', element: <SkinTreatment /> },
    { path: '/results', element: <BeforeAfterPage /> },
    { path: '/confirmation', element: <Confirmation /> },
    { path: '/pricing', element: <PricingPage /> },
    { path: '/gallery', element: <ClinicGallery /> },
    { path: '/offers', element: <OffersPage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/ai-analysis', element: comingSoonPage('AI Skin Analysis') },
    { path: '/contact', element: <ContactPage /> },
];

const AppRouter = () => {
    return (
        <>
            <ScrollToTop />
            <Header />
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route element={<MainLayout />}>
                        {publicRoutes.map((route) => (
                            <Route key={route.path} path={route.path} element={route.element} />
                        ))}
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
            </Suspense>
        </>
    );
};

export default AppRouter;
