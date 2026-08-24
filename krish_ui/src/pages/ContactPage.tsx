import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { apiClient } from '../services/apiClient';
import { useTreatments } from '../hooks/useTreatments';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { treatments } = useTreatments();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    treatmentName: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  useSEO({
    title: 'Book an Appointment',
    description: 'Book a consultation at De Royal Kore Clinic and receive confirmation instantly.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setIsSubmitting(true);

    try {
      await apiClient.createAppointment({
        name: form.name,
        phone: form.phone,
        email: form.email,
        treatmentId: 'contact-page',
        treatmentName: form.treatmentName || 'Consultation',
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        message: form.message,
      });

      setStatus('Appointment request received. Please check your email for confirmation.');
      setForm({
        name: '',
        phone: '',
        email: '',
        treatmentName: 'Consultation',
        preferredDate: '',
        preferredTime: '',
        message: '',
      });
      setTimeout(() => navigate('/confirmation'), 800);
    } catch (error: any) {
      setStatus(error?.message || 'Unable to submit booking right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-90px)] bg-[#FDFBF7] pt-8 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#E7D8BF] bg-white p-8 shadow-xl sm:p-10 lg:p-12">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D9A577]">Book a consultation</p>
          <h1 className="mt-3 text-4xl font-bold text-[#3A2D23] sm:text-5xl">Let’s plan your skin journey</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#5D4634]">Share your details and we’ll confirm your preferred treatment slot as soon as possible.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3A2D23]">Full name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-[#E7D8BF] px-4 py-3 outline-none focus:border-[#D9A577]" placeholder="Enter your name" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3A2D23]">Phone number</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-[#E7D8BF] px-4 py-3 outline-none focus:border-[#D9A577]" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3A2D23]">Email address</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-[#E7D8BF] px-4 py-3 outline-none focus:border-[#D9A577]" placeholder="you@example.com" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3A2D23]">Treatment Interest</label>
              <select
                value={form.treatmentName}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, treatmentName: val });
                  if (val) {
                    navigate(`/treatment/${val}`);
                  }
                }}
                className="w-full rounded-xl border border-[#E7D8BF] bg-white px-4 py-3 outline-none focus:border-[#D9A577] text-sm font-medium text-[#3A2D23]"
              >
                <option value="">Select a Treatment...</option>
                {treatments.map((t) => (
                  <option key={t._id || t.slug} value={t.slug || t._id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3A2D23]">Preferred date</label>
                <input type="date" required value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} className="w-full rounded-xl border border-[#E7D8BF] px-4 py-3 outline-none focus:border-[#D9A577]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#3A2D23]">Preferred time</label>
                <input required value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} className="w-full rounded-xl border border-[#E7D8BF] px-4 py-3 outline-none focus:border-[#D9A577]" placeholder="10:30 AM" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3A2D23]">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full rounded-xl border border-[#E7D8BF] px-4 py-3 outline-none focus:border-[#D9A577]" placeholder="Tell us about your goals or concerns" />
            </div>
          </div>

          <div className="lg:col-span-2">
            {status && <p className="mb-4 rounded-xl border border-[#E7D8BF] bg-[#F8F1E6] px-4 py-3 text-[#5D4634]">{status}</p>}
            <button type="submit" disabled={isSubmitting} className="rounded-full bg-[#3A2D23] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.25em] text-[#F2E9D8] transition hover:bg-[#251D16] disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? 'Submitting request...' : 'Book appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
