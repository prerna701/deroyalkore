import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { useAppContext } from '../context/AppContext';
import { UI_STRINGS, TIME_SLOTS, CALENDAR_DAYS } from '../constants/uiContent';
import BeforeAfter from '../components/ui/BeforeAfter';
import GlossyButton from '../components/ui/GlossyButton';
import { apiClient } from '../services/apiClient';
import { Treatment } from '../types';
import toast from 'react-hot-toast';
import { resolveImageUrl } from '../utils/resolveImageUrl';

const SkinTreatment: React.FC = memo(() => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setUserData } = useAppContext();

    const [treatment, setTreatment] = useState<Treatment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        apiClient.getTreatment(id)
            .then(data => setTreatment(data))
            .catch(err => {
                console.error(err);
                setTreatment(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const [step, setStep] = useState(0);
    const [activeTab, setActiveTab] = useState<'protocol' | 'benefits' | 'bestFor'>('protocol');
    const [selectedDate, setSelectedDate] = useState(15);
    const [selectedTime, setSelectedTime] = useState('10:30 AM');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useSEO({
        title: treatment?.title || 'Treatment Details',
        description: treatment?.about || 'Professional skin treatments at De Royal Kore Clinic'
    });

    const handleBack = useCallback(() => {
        if (step === 0) {
            navigate('/treatments');
        } else {
            setStep((s) => s - 1);
        }
    }, [step, navigate]);

    const handleContinue = useCallback(async () => {
        if (step < 2) {
            setStep((s) => s + 1);
            return;
        }

        if (!formData.name || !formData.name.trim()) {
            toast.error('Please enter your full name');
            return;
        }

        if (!formData.phone || !/^\d{10}$/.test(formData.phone.trim())) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const dateStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
            await apiClient.createAppointment({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                treatmentId: id,
                treatmentName: treatment?.title,
                preferredDate: dateStr,
                preferredTime: selectedTime,
                message: `Requested consultation for ${treatment?.title}`,
            });

            setUserData(formData);
            toast.success('Your appointment has been successfully booked!');
            navigate('/confirmation', { state: { treatment: treatment, date: dateStr, time: selectedTime } });
        } catch (error: any) {
            const errorMsg = error?.message || 'Unable to book appointment right now.';
            setSubmitError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    }, [step, formData, setUserData, navigate, id, treatment?.title, selectedTime]);

    const handleStepOne = useCallback(() => setStep(1), []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-90px)] flex items-center justify-center bg-[#FDFBF7]">
                <h1 className="text-2xl text-[#3A2D23]">Loading details...</h1>
            </div>
        );
    }

    if (!treatment) {
        return (
            <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-90px)] flex flex-col items-center justify-center bg-[#FDFBF7]">
                <h1 className="text-3xl font-bold text-[#3A2D23] mb-4">Treatment Not Found</h1>
                <GlossyButton onClick={handleBack}>Return to Treatments</GlossyButton>
            </div>
        );
    }

    const { booking: bUi } = UI_STRINGS;

    // STEP 0: New Luxury Layout
    if (step === 0) {
        return (
            <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-90px)] bg-[#FDFBF7] pt-20 pb-8">
                {/* Breadcrumb & Navigation */}
                <div className="mx-auto max-w-6xl px-6 lg:px-8 mb-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-[#8B7A66] hover:text-[#5D4634] transition-colors font-sans text-sm tracking-widest uppercase font-bold"
                    >
                        <span className="material-symbols-outlined mr-2 text-lg">arrow_back</span>
                        Back to Treatments
                    </button>
                </div>

                {/* Hero Section */}
                <div className="mx-auto max-w-6xl px-6 lg:px-8 mb-8">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="w-full lg:w-1/2 space-y-6">
                            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3A2D23] leading-tight">
                                {treatment.title}
                            </h1>
                            <div className="h-1 w-20 bg-[#D9A577]"></div>
                            <p className="font-sans text-xl md:text-2xl italic text-[#5D4634] leading-relaxed">
                                {treatment.about}
                            </p>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-video max-h-[300px] w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-[#E7D8BF]">
                                <img 
                                    src={resolveImageUrl(treatment.image)}
                                    alt={treatment.title}
                                    className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mx-auto max-w-6xl px-6 lg:px-8 mb-10 mt-6">
                    <div className="flex flex-col md:flex-row gap-8 bg-white rounded-3xl p-8 shadow-xl border border-[#E7D8BF]">
                        {/* Sidebar Tabs */}
                        <div className="w-full md:w-1/3 flex flex-col gap-3 border-r-0 md:border-r border-[#E7D8BF] md:pr-8">
                            <button 
                                onClick={() => setActiveTab('protocol')}
                                className={`text-left px-6 py-4 rounded-2xl font-sans text-lg font-bold transition-all ${activeTab === 'protocol' ? 'bg-[#3A2D23] text-[#D9A577]' : 'bg-[#FDFBF7] text-[#5D4634] hover:bg-[#F2E9D8]'}`}
                            >
                                Treatment Protocol
                            </button>
                            <button 
                                onClick={() => setActiveTab('benefits')}
                                className={`text-left px-6 py-4 rounded-2xl font-sans text-lg font-bold transition-all ${activeTab === 'benefits' ? 'bg-[#3A2D23] text-[#D9A577]' : 'bg-[#FDFBF7] text-[#5D4634] hover:bg-[#F2E9D8]'}`}
                            >
                                Key Benefits
                            </button>
                            <button 
                                onClick={() => setActiveTab('bestFor')}
                                className={`text-left px-6 py-4 rounded-2xl font-sans text-lg font-bold transition-all ${activeTab === 'bestFor' ? 'bg-[#3A2D23] text-[#D9A577]' : 'bg-[#FDFBF7] text-[#5D4634] hover:bg-[#F2E9D8]'}`}
                            >
                                Best For
                            </button>
                        </div>
                        
                        {/* Tab Content */}
                        <div className="w-full md:w-2/3 md:pl-4 flex flex-col justify-start min-h-[200px] max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {activeTab === 'protocol' && (
                                <div className="animate-in fade-in slide-in-from-right-2 duration-500">
                                    <div className="flex items-center mb-6">
                                        <span className="material-symbols-outlined text-3xl text-[#D9A577] mr-4">description</span>
                                        <h2 className="font-sans text-2xl font-bold text-[#3A2D23]">Treatment Protocol</h2>
                                    </div>
                                    <p className="font-sans text-lg text-[#5D4634] leading-relaxed">
                                        {(treatment as any).protocol || 'Our professional treatment protocol ensures maximum results and safety tailored specifically for your skin needs.'}
                                    </p>
                                    <div className="mt-6 inline-block bg-[#F2E9D8] rounded-xl px-4 py-2">
                                        <span className="font-sans font-bold text-[#3A2D23] text-sm uppercase tracking-wider">Sessions: {treatment.sessions}</span>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'benefits' && (
                                <div className="animate-in fade-in slide-in-from-right-2 duration-500">
                                    <div className="flex items-center mb-6">
                                        <span className="material-symbols-outlined text-3xl text-[#D9A577] mr-4">auto_awesome</span>
                                        <h2 className="font-sans text-2xl font-bold text-[#3A2D23]">Key Benefits</h2>
                                    </div>
                                    <ul className="space-y-4">
                                        {treatment.benefits.map((item, idx) => (
                                            <li key={idx} className="flex items-center text-[#5D4634]">
                                                <span className="material-symbols-outlined text-[#D9A577] mr-3 text-sm">star</span>
                                                <span className="font-sans text-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'bestFor' && (
                                <div className="animate-in fade-in slide-in-from-right-2 duration-500">
                                    <div className="flex items-center mb-6">
                                        <span className="material-symbols-outlined text-3xl text-[#D9A577] mr-4">target</span>
                                        <h2 className="font-sans text-2xl font-bold text-[#3A2D23]">Best For</h2>
                                    </div>
                                    <ul className="space-y-4">
                                        {treatment.bestFor.map((item, idx) => (
                                            <li key={idx} className="flex items-center text-[#5D4634]">
                                                <span className="material-symbols-outlined text-[#D9A577] mr-3 text-sm">check_circle</span>
                                                <span className="font-sans text-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="mb-10">
                    <BeforeAfter miniHeader={true} onViewAll={() => navigate('/results')} />
                </div>

                {/* Client Review Section */}
                <div className="mx-auto max-w-4xl px-6 lg:px-8 mb-12">
                    <div className="relative bg-[#F2E9D8] rounded-3xl p-10 md:p-14 text-center shadow-md">
                        <span className="absolute top-6 left-1/2 -translate-x-1/2 text-6xl text-[#D9A577]/30 font-sans leading-none">"</span>
                        <p className="relative z-10 font-sans text-2xl md:text-3xl italic text-[#3A2D23] leading-relaxed mt-4">
                            "The {treatment.title} completely changed my skin. The clinic's approach was highly professional, and they set very realistic expectations. After my sessions, the results were even better than I hoped!"
                        </p>
                        <div className="mt-8 flex items-center justify-center flex-col">
                            <div className="flex text-[#D9A577] mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="material-symbols-outlined text-xl">star</span>
                                ))}
                            </div>
                            <p className="font-sans font-bold tracking-widest uppercase text-xs text-[#5D4634]">Verified Patient</p>
                        </div>
                    </div>
                </div>

                {/* Premium Book Consultation Section */}
                <div className="mx-auto max-w-5xl px-6 lg:px-8 mb-10">
                    <div className="relative overflow-hidden bg-[#3A2D23] rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A577] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D9A577] rounded-full blur-[100px] opacity-20 -ml-20 -mb-20"></div>
                        
                        <div className="relative z-10 w-full md:w-3/5 mb-8 md:mb-0 text-center md:text-left">
                            <h2 className="font-sans text-3xl md:text-5xl font-bold text-[#FDFBF7] mb-4 leading-tight">
                                Ready to transform your skin?
                            </h2>
                            <p className="font-sans text-lg text-[#E7D8BF] opacity-90 max-w-lg">
                                Schedule your expert consultation today and discover the perfect treatment plan tailored for you.
                            </p>
                        </div>
                        
                        <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-end">
                            <GlossyButton
                                onClick={handleStepOne}
                                className="w-full sm:w-auto min-w-[220px] shadow-[0_10px_40px_rgba(217,165,119,0.3)] !bg-[#D9A577] hover:!bg-[#c28d5e] !text-[#ffffff]"
                            >
                                Book Consultation
                            </GlossyButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // STEP 1 and 2: The Booking Wizard
    return (
        <div className="bg-background-dark text-white flex flex-col selection:bg-primary/30 overflow-hidden fixed top-[64px] lg:top-[90px] left-0 right-0 bottom-0 h-[calc(100vh-64px)] lg:h-[calc(100vh-90px)] z-40">
            <header className="flex items-center bg-background-dark p-3 border-b border-white/5 h-14 shrink-0 px-6">
                <button
                    onClick={handleBack}
                    className="text-white flex items-center justify-center transition-all hover:text-primary p-1.5 rounded-full border border-white/5 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
                <div className={`lg:w-1/3 h-1/4 lg:h-full relative overflow-hidden shrink-0 transition-all duration-700 ${step === 2 ? 'lg:w-[15%] opacity-40 grayscale' : ''}`}>
                    <img src={resolveImageUrl(treatment.image)} alt={treatment.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0D0B08] via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 lg:p-10 space-y-2 z-10 w-full">
                        <span className="text-primary text-[9px] font-bold uppercase tracking-[0.4em]">{treatment.title}</span>
                        <h2 className={`font-bold leading-tight transition-all duration-700 ${step === 2 ? 'text-sm' : 'text-2xl md:text-4xl'}`}>{treatment.title}</h2>
                    </div>
                </div>

                <div className="flex-1 flex-col md:flex-row flex min-h-0 p-4 lg:p-12 gap-4 lg:gap-12 relative overflow-hidden bg-[#0A0A0A]/30 backdrop-blur-xl">
                    {step === 1 && (
                        <div className="flex-1 flex-col md:flex-row flex gap-6 lg:gap-12 animate-in fade-in slide-in-from-right-1 duration-700">
                            <div className="flex-1 min-h-0 flex flex-col">
                                <StepBadge number={bUi.steps.date.number} label={bUi.steps.date.label} />
                                <div className="flex-1 bg-[#232323] rounded-3xl p-6 border border-white/10 flex flex-col justify-center min-h-0 shadow-2xl">
                                    <div className="flex items-center justify-between mb-4 shrink-0">
                                        <button className="hover:text-primary transition-all p-1.5 cursor-pointer"><span className="material-symbols-outlined text-base">chevron_left</span></button>
                                        <p className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">{bUi.steps.date.monthYear}</p>
                                        <button className="hover:text-primary transition-all p-1.5 cursor-pointer"><span className="material-symbols-outlined text-base">chevron_right</span></button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-[9px]">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                            <p key={d} className="text-white/20 font-bold uppercase tracking-widest h-6 flex items-center justify-center">{d}</p>
                                        ))}
                                        <div className="col-span-1 h-6"></div>
                                        {CALENDAR_DAYS.map((d, i) => (
                                            <button
                                                key={i}
                                                onClick={() => d.current && setSelectedDate(d.day)}
                                                className={`h-8 w-8 mx-auto transition-all flex items-center justify-center rounded-xl font-bold cursor-pointer
                                                    ${!d.current ? 'text-white/5 cursor-not-allowed' :
                                                        selectedDate === d.day ? 'bg-[#6E1CED] text-white shadow-lg shadow-[#6E1CED]/40' : 'text-white/80 hover:bg-[#6E1CED]/20 hover:text-white'}`}
                                                disabled={!d.current}
                                            >
                                                {d.day}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 min-h-0 flex flex-col">
                                <StepBadge number={bUi.steps.time.number} label={bUi.steps.time.label} />
                                <div className="flex-1 bg-[#232323] rounded-3xl p-6 border border-white/10 flex flex-col justify-center min-h-0 shadow-2xl">
                                    <div className="grid grid-cols-2 gap-3">
                                        {TIME_SLOTS.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-4 rounded-2xl border transition-all text-[9px] font-bold uppercase tracking-[0.2em] cursor-pointer
                                                    ${selectedTime === time ? 'bg-[#6E1CED] border-[#6E1CED] text-white shadow-lg shadow-[#6E1CED]/40' : 'bg-white/[0.1] border-white/20 text-white/90 hover:border-[#6E1CED] hover:bg-[#6E1CED]/20 hover:text-white'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex-1 flex flex-col max-w-xl mx-auto items-center justify-center animate-in fade-in slide-in-from-right-1 duration-700">
                            <div className="w-full space-y-6">
                                <div className="text-center space-y-2">
                                    <h3 className="text-3xl font-bold text-white tracking-tight">{bUi.steps.personal.title}</h3>
                                    <p className="text-white/40 text-[10px] uppercase tracking-[0.4em]">{bUi.steps.personal.subtitle}</p>
                                </div>

                                <div className="space-y-4 bg-[#232323] p-8 md:p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-3xl">
                                    <InputField label={bUi.steps.personal.fields.name} value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="Enter your name" />
                                    <InputField label={bUi.steps.personal.fields.phone} value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="+91 00000 00000" type="tel" />
                                    <InputField
                                        label={bUi.steps.personal.fields.email}
                                        optional={bUi.steps.personal.fields.emailOptional}
                                        value={formData.email}
                                        onChange={(v) => setFormData({ ...formData, email: v })}
                                        placeholder="your@email.com"
                                        type="email"
                                    />
                                    {submitError && <p className="text-sm text-red-400">{submitError}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <div className="bg-[#14120F] border-t border-white/10 p-5 md:p-8 shrink-0 flex justify-center h-28 md:h-32">
                <div className="max-w-5xl w-full flex items-center justify-between gap-6 md:gap-12">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-white/30 uppercase tracking-[0.4em] mb-1 font-bold">{bUi.footer.summary}</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-primary text-sm font-bold">₹</span>
                            <span className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
                                {treatment.discountPrice || treatment.price}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleContinue}
                        disabled={isSubmitting || (step === 2 && (!formData.name || !formData.phone))}
                        className={`btn-85 flex-1 max-w-[320px] shadow-2xl cursor-pointer ${isSubmitting || (step === 2 && (!formData.name || !formData.phone)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className="tracking-[0.3em] ml-[0.3em]">{isSubmitting ? 'Booking...' : (step === 1 ? bUi.footer.nextStep : bUi.footer.confirm)}</span>
                        <span className="material-symbols-outlined text-xl md:text-2xl">{isSubmitting ? 'hourglass_top' : (step === 1 ? 'arrow_forward' : 'check_circle')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

const StepBadge = memo(({ number, label }: { number: string, label: string }) => (
    <div className="flex items-center gap-3 mb-4 shrink-0">
        <span className="text-primary font-bold text-sm">{number}</span>
        <h3 className="text-white/40 text-[9px] font-bold tracking-[0.2em] uppercase">{label}</h3>
        <div className="h-px flex-1 bg-white/5"></div>
    </div>
));

const InputField = memo(({ label, optional, value, onChange, placeholder, type = "text" }: { label: string, optional?: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string }) => (
    <div className="space-y-1.5">
        <label className={`text-[9px] uppercase tracking-[0.4em] font-bold ml-1 flex justify-between ${optional ? 'text-white/20' : 'text-primary'}`}>
            {label}
            {optional && <span className="text-[7px] font-normal lowercase tracking-widest">{optional}</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all text-xs"
        />
    </div>
));

SkinTreatment.displayName = "SkinTreatment";
StepBadge.displayName = "StepBadge";
InputField.displayName = "InputField";

export default SkinTreatment;
