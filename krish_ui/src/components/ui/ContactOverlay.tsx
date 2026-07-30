import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';
import type { SiteContact } from '../../types';

interface ContactOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const fallbackContact: SiteContact = {
  id: 'fallback-contact',
  heading: 'Contact Us!',
  address: 'House No. 142, Near Sports Complex, Sector 78, Sahibzada Ajit Singh Nagar, Punjab 140308',
  phone: '+91-70870-00365',
  website: 'www.zivaskinclinic.com',
  mapLink: '#',
  timings: [
    { label: 'Mon - Tue', value: '10:00am to 2:00pm & 4:00pm to 7:00pm' },
    { label: 'Wednesday', value: 'Closed', isClosed: true },
    { label: 'Thu - Sat', value: '10:00am to 2:00pm & 4:00pm to 7:00pm' },
    { label: 'Sunday', value: '11:00am to 2:00pm' },
  ],
};

const ContactOverlay: React.FC<ContactOverlayProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState<SiteContact>(fallbackContact);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    apiClient.getContactSections()
      .then((records) => {
        if (isMounted && Array.isArray(records) && records[0]) {
          setContent(records[0]);
        }
      })
      .catch(() => {
        if (isMounted) setContent(fallbackContact);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      ></div>

      {/* Contact Card */}
      <div className="relative w-full max-w-5xl bg-white border-[4px] border-[#8C6D1F] rounded-3xl overflow-hidden shadow-[0_15px_60px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-black/50 hover:text-primary transition-all z-20 hover:rotate-90"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative p-8 md:p-16 flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-black text-4xl md:text-5xl font-bold mb-3 tracking-tight">
              {content.heading}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 w-full">

            {/* Left: Location */}
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-black space-y-3 text-sm md:text-base italic">
                <p className="max-w-[280px] leading-relaxed">{content.address}</p>
                <p className="text-primary font-semibold not-italic">{content.phone}</p>
                <p className="text-primary/60 underline hover:text-primary transition-colors cursor-pointer not-italic">{content.website}</p>
              </div>
              <a href={content.mapLink || '#'} className="text-black font-bold text-[10px] tracking-[4px] uppercase border-b border-primary pb-1 hover:text-primary transition-all">
                Locate us on map
              </a>
            </div>

            {/* Right: Timings */}
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-black/80 space-y-4 text-xs md:text-sm tracking-wide">
                {content.timings.map((timing) => (
                  <div key={timing.label}>
                    <p className={`${timing.isClosed ? 'text-red-500 opacity-70' : 'text-black opacity-60'} uppercase font-bold text-[10px] mb-1`}>
                      {timing.label}
                    </p>
                    <p className={timing.isClosed ? 'line-through opacity-40' : ''}>{timing.value}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactOverlay;
