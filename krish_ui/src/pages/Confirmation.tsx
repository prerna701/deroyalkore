import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { treatmentsData } from '../data/treatmentsData';
import { useAppContext } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';

const Confirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useAppContext();

    // Get treatmentId from navigation state
    const treatmentId = (location.state as any)?.treatmentId;
    const treatment = treatmentId ? treatmentsData[treatmentId] : null;

    const [showReceipt, setShowReceipt] = useState(false);

    useSEO({
        title: 'Booking Confirmed',
        description: 'Your ritual has been secured at Krishi Skin Clinic'
    });

    const onBackToHome = () => navigate('/');

    const bookingId = "AUR-" + Math.random().toString(36).substr(2, 6).toUpperCase();

    return (
        <div className="bg-background-dark text-white h-screen flex flex-col overflow-hidden selection:bg-primary/30 relative">

            {/* Extremely Compact Header */}
            <header className="flex items-center bg-background-dark p-3 border-b border-white/5 h-14 shrink-0 px-6">
                <button
                    onClick={onBackToHome}
                    className="text-white flex items-center justify-center transition-all hover:text-primary p-1.5 rounded-full border border-white/5"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
                <div className="flex-1 flex justify-center">
                    <h1 className="text-xs font-bold tracking-[0.3em] uppercase text-primary">
                        RITUAL <span className="text-white/20 font-light ml-1">SECURED</span>
                    </h1>
                </div>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-10 gap-4 items-center min-h-0 overflow-hidden relative">

                {/* 1. Success Message (Horizontal & Slim) */}
                <div className="flex flex-row items-center gap-6 shrink-0 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse"></div>
                        <div className="relative flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full border-2 border-primary bg-primary/5">
                            <span className="material-symbols-outlined text-primary text-2xl md:text-4xl">check_circle</span>
                        </div>
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-px w-4 bg-primary/40"></span>
                            <span className="text-[7px] md:text-[9px] font-bold text-primary tracking-[0.5em] uppercase">Appointment Confirmed</span>
                        </div>
                        <h2 className="text-xl md:text-4xl font-bold leading-none tracking-tight">Ritual Secured for {userData?.name?.split(' ')[0]}</h2>
                        <p className="text-white/20 text-[7px] md:text-[8px] font-bold tracking-[0.4em] uppercase mt-2">Reference ID: {bookingId}</p>
                    </div>
                </div>

                {/* 2. Dashboard with Large Map */}
                <div className="w-full max-w-6xl flex-1 flex flex-col md:flex-row gap-4 min-h-0 overflow-hidden">

                    {/* Left: Summary Cards (Date, Time, Service) */}
                    <div className="w-full md:w-80 flex flex-col gap-3 shrink-0">
                        {/* Service Card */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
                            <img
                                src={treatment?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCzWJdTZ_bVFDrTjpIFGp4T6UAgR8OBmBBda03bJSvKybhdQW5Plb0TogTckPmzr6Naf5LHYP82d8xOdK9kylcTGqes2tpMW3rB5I441V8myTPWBYzYtzWa9fjgP8Yfzu_5xVpnyxxBAj9AAfd2gwFqESsPig28WE_a9OpELmHCp4h1qCo-KBueGT1uUwx8u6y0j2cvq_-8SFqHSAqDY0yYdl0KPNMx0-F1cHgJkAUnGEipOW9c8eWG3j7Yn3v9RJR4vwTLHFA_o24R"}
                                alt="Service"
                                className="size-12 rounded-xl object-cover grayscale"
                            />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-primary/40 text-[7px] font-bold uppercase tracking-widest">{treatment?.subtitle || 'Ritual'}</p>
                                <h3 className="text-[10px] md:text-xs font-bold truncate">{treatment?.title || 'Signature Ritual'}</h3>
                            </div>
                        </div>

                        {/* Date/Time Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
                                <span className="material-symbols-outlined text-primary text-base mb-1">calendar_month</span>
                                <p className="text-white font-bold text-[9px] uppercase tracking-widest">Oct 24</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
                                <span className="material-symbols-outlined text-primary text-base mb-1">schedule</span>
                                <p className="text-white font-bold text-[9px] uppercase tracking-widest">2:30 PM</p>
                            </div>
                        </div>

                        {/* Download Receipt Card */}
                        <button
                            onClick={() => setShowReceipt(true)}
                            className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between group hover:bg-primary transition-all duration-500 hover:text-[#0D0B08]"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg">receipt_long</span>
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Download Receipt</span>
                            </div>
                            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">download</span>
                        </button>

                        <div className="flex-1 hidden md:block"></div>
                    </div>

                    {/* Right: Large Map Section */}
                    <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden relative group shadow-2xl min-h-0">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2IiEowLfd7RvZVULdu9j0wsX4a6f-xwenFo9f58x8YZTQfeuEUOPWm75N1rARHAMpr7Hc35vJINIhCYjJ0P6FxQwCS5wbt7k9oP87tzTCki13fmk342bd106cSNtzdF_rEYr4TlNc9UytPY9NNhwt8X-IhLE-kxmkQ6rYl4WT2CkRtX6TmqK4GQJF_UGb2eOnlPmo80-xUx8T3MwOcv4ijnIv7jv-JvG4MrQFqkaH3cRUbeddXuRVVaueRKx1DZZOxInRgekmEFYF"
                            alt="Map"
                            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute top-6 left-6 p-4 md:p-6 bg-[#0D0B08]/80 backdrop-blur-xl border border-white/10 rounded-2xl max-w-xs transition-all pointer-events-none group-hover:border-primary/40">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Aura Pavilion</h4>
                            </div>
                            <p className="text-white/40 text-[9px] leading-relaxed italic">77 Golden Boulevard, Floor 4, Luxury District</p>
                        </div>
                        <button className="absolute bottom-6 right-6 h-10 w-10 md:h-12 md:w-12 bg-primary rounded-full flex items-center justify-center text-[#0D0B08] shadow-2xl active:scale-90 transition-all">
                            <span className="material-symbols-outlined">directions</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Bottom Toolbar - Relocated Buttons */}
            <div className="bg-[#14120F] border-t border-white/10 p-4 md:p-6 px-10 shrink-0 flex items-center justify-between h-24 md:h-28 z-40">
                <div className="flex gap-4 w-full max-w-5xl mx-auto">
                    <button className="flex-1 btn-85 flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-lg">calendar_add_on</span>
                        <span>Calendar</span>
                    </button>
                    <button
                        onClick={onBackToHome}
                        className="flex-1 btn-85 flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-lg">home</span>
                        <span>Home</span>
                    </button>
                </div>
            </div>

            {/* Receipt Modal Overlay */}
            {showReceipt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="absolute inset-0 bg-[#0D0B08]/90 backdrop-blur-lg" onClick={() => setShowReceipt(false)}></div>
                    <div className="relative bg-[#1A1712] border border-white/10 w-full max-w-md rounded-[3rem] p-10 md:p-14 shadow-4xl animate-in zoom-in-95 duration-500">
                        <button
                            onClick={() => setShowReceipt(false)}
                            className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>

                        <div className="text-center space-y-8">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-[0.2em] text-primary">AURUM</h1>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.5em]">Official Transaction Receipt</p>
                            </div>

                            <div className="h-px w-full bg-white/10"></div>

                            <div className="space-y-4 text-left">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Client Name</span>
                                    <span className="text-sm text-white tracking-widest">{userData?.name || 'Guest'}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Phone</span>
                                    <span className="text-sm text-white/80">{userData?.phone}</span>
                                </div>
                                {userData?.email && (
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Email</span>
                                        <span className="text-xs text-white/60">{userData?.email}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-baseline pt-4">
                                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Ritual</span>
                                    <span className="text-sm text-primary italic">{treatment?.title}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">DateTime</span>
                                    <span className="text-sm text-white">Oct 24 • 2:30 PM</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Total paid</span>
                                    <span className="text-xl text-white">${treatment?.price}</span>
                                </div>
                            </div>

                            <div className="h-px w-full bg-white/10"></div>

                            <div className="pt-4 flex flex-col items-center gap-4">
                                <div className="size-24 border border-white/10 p-2 rounded-2xl bg-white/[0.02]">
                                    {/* Mock QR Code */}
                                    <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full p-2 grayscale">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-primary/40' : 'bg-white/5'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    className="btn-85 w-full"
                                    onClick={() => window.print()}
                                >
                                    Print Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Minimal Mobile Nav */}
            <nav className="shrink-0 bg-[#0D0B08] border-t border-white/5 px-6 pb-6 pt-2 md:hidden">
                <div className="flex gap-4 max-w-[500px] mx-auto items-center justify-between">
                    {[
                        { label: 'Home', icon: 'home', active: false, action: onBackToHome },
                        { label: 'Status', icon: 'verified', active: true, inner: true },
                        { label: 'Profile', icon: 'person', active: false }
                    ].map((item, i) => (
                        <button key={i} onClick={item.action} className={`flex flex-col items-center justify-center gap-1 ${item.active ? 'text-primary' : 'text-white/20'}`}>
                            <span className="material-symbols-outlined text-lg">{item.icon}</span>
                            <span className="text-[6px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default Confirmation;
