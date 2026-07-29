import React, { useEffect, useState } from 'react';
import { getFaqs, type FAQItem } from '../../services/faqService';

const FAQSection: React.FC = () => {
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getFaqs(1, 10);
        setFaqData(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load FAQs');
      } finally {
        setIsLoading(false);
      }
    };

    loadFaqs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="flex min-h-screen items-center bg-cream px-6 py-12 sm:min-h-[100svh] lg:py-16">
      <div className="max-w-4xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-slate-950 text-3xl md:text-4xl font-bold relative inline-block">
            Frequently Asked Questions
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></span>
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {isLoading && (
            <div className="rounded-lg border border-primary/10 bg-white/80 p-4 text-center text-sm text-slate-700">
              Loading FAQs...
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {!isLoading && !error && faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.id || `${item.question}-${index}`}
                className="overflow-hidden border border-primary/10 rounded-lg transition-all duration-300"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full flex items-center justify-between gap-4 p-4 text-left transition-all duration-300 md:p-5 ${isOpen
                      ? 'bg-slate-950 text-primary'
                      : 'bg-cream/50 text-slate-950 hover:bg-cream'
                    }`}
                >
                  <span className="font-bold text-sm md:text-base tracking-tight">
                    {item.question}
                  </span>

                  {/* Chevron Icon */}
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-gray-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Answer Body (Animated Height) */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 text-sm md:text-base text-gray-700 bg-white leading-relaxed border-t border-primary/10 md:p-5">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
