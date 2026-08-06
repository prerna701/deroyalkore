import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import GlossyButton from '../components/ui/GlossyButton';
import toast from 'react-hot-toast';

const Confirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useAppContext();

    const treatment = (location.state as any)?.treatment || null;
    const date = (location.state as any)?.date || 'TBD';
    const time = (location.state as any)?.time || 'TBD';

    const [showReceipt, setShowReceipt] = useState(false);

    useSEO({
        title: 'Booking Confirmed',
        description: 'Your ritual has been secured at Krishi Skin Clinic'
    });

    const onBackToHome = () => navigate('/');

    const bookingId = "AUR-" + Math.random().toString(36).substr(2, 6).toUpperCase();

    const handleDownloadReceipt = () => {
        const receiptElement = document.getElementById('receipt-content');
        if (!receiptElement) {
            toast.error('Receipt content not found');
            return;
        }
        
        toast.promise(
            (async () => {
                const canvas = await html2canvas(receiptElement, { backgroundColor: '#1A1712', scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`receipt-${bookingId}.pdf`);
            })(),
            {
                loading: 'Generating PDF receipt...',
                success: 'Receipt downloaded successfully!',
                error: 'Failed to generate PDF receipt',
            }
        );
    };

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
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center shadow-md">
                                <span className="material-symbols-outlined text-[#D9A577] text-xl mb-1">calendar_month</span>
                                <p className="text-white font-bold text-[10px] uppercase tracking-widest">{date}</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center shadow-md">
                                <span className="material-symbols-outlined text-[#D9A577] text-xl mb-1">schedule</span>
                                <p className="text-white font-bold text-[10px] uppercase tracking-widest">{time}</p>
                            </div>
                        </div>

                        {/* Download Receipt Card */}
                        <div className="mt-2">
                            <GlossyButton onClick={() => setShowReceipt(true)} className="w-full flex items-center justify-between !py-4 !min-h-[50px] !px-6">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                                    <span className="text-[11px] uppercase tracking-[0.2em]">View Receipt</span>
                                </div>
                            </GlossyButton>
                        </div>

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

            {/* Receipt Modal Overlay */}
            {showReceipt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
                    <div className="absolute inset-0 bg-[#0D0B08]/90 backdrop-blur-lg" onClick={() => setShowReceipt(false)}></div>
                    <div className="relative bg-[#1A1712] border border-white/10 w-full max-w-md rounded-[3rem] p-10 md:p-14 shadow-4xl animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={() => setShowReceipt(false)}
                            className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-10"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>

                        <div id="receipt-content" className="text-center space-y-8 bg-[#1A1712] p-4 rounded-xl">
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
                                    <span className="text-sm text-white">{date} • {time}</span>
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
                            </div>
                        </div>
                        
                        <div className="mt-8">
                            <GlossyButton
                                className="w-full !min-h-[50px] !py-3"
                                onClick={handleDownloadReceipt}
                            >
                                Download Receipt
                            </GlossyButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Confirmation;
