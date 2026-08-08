import React, { useRef } from 'react';
import GlossyButton from './GlossyButton';

// TypeScript interface for the data
interface Testimonial {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Himanshu Thakur",
    date: "2 weeks ago",
    rating: 5,
    text: "Excellent service at Ziva Skin Care. The consultation was professional and well-structured, with personalized recommendations tailored to my skin concerns. The overall experience was smooth and satisfactory. Highly recommended.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Sahil Dhingla",
    date: "2 weeks ago",
    rating: 5,
    text: "Very good acne treatment by Dr. Ankit Mittal. The results started showing within a few weeks and the staff is very supportive.",
    image: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    id: 3,
    name: "Anushka Sharma",
    date: "2 weeks ago",
    rating: 5,
    text: "Dr is highly knowledgeable and professional. The diagnosis was accurate, and the treatment plan was explained in detail. Truly a premium experience.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 4,
    name: "Rahul Verma",
    date: "1 month ago",
    rating: 5,
    text: "Amazing experience with laser hair reduction. The clinic is very hygienic, the equipment is world-class, and the staff is extremely well trained.",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: 5,
    name: "Priya Singh",
    date: "1 month ago",
    rating: 5,
    text: "I have been visiting for melasma treatment. The diagnosis was spot on and my skin has never looked better! The glow is unreal.",
    image: "https://randomuser.me/api/portraits/women/28.jpg"
  },
  {
    id: 6,
    name: "Deepak Sharma",
    date: "2 months ago",
    rating: 5,
    text: "Very professional team. The acne scar treatment using CO2 laser gave me fantastic results. Worth every penny for the confidence boost.",
    image: "https://randomuser.me/api/portraits/men/11.jpg"
  }
];

const TestimonialsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#F2E9D8] via-[#EADBCA] to-[#D9A577] min-h-[calc(100vh-90px)] py-12 px-6 flex flex-col justify-center w-full relative overflow-hidden">
      
      {/* Decorative massive quote mark in the background */}
      <div className="absolute -top-10 -right-10 text-[400px] text-primary opacity-5 select-none pointer-events-none font-serif leading-none">
        "
      </div>
      <div className="absolute -bottom-32 -left-20 text-[400px] text-primary opacity-5 select-none pointer-events-none font-serif leading-none rotate-180">
        "
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start lg:items-center max-w-[1400px] mx-auto w-full relative z-10">
        {/* Left Stats Card */}
        <div className="w-full lg:w-1/3 bg-white/80 backdrop-blur-md p-8 lg:p-12 rounded-[2.5rem] shadow-xl border border-primary/20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-950 rounded-2xl flex items-center justify-center mb-8 border border-primary shadow-lg">
            <span className="text-primary text-5xl font-bold tracking-tighter">DRK</span>
          </div>

          <h3 className="text-slate-950 font-bold text-3xl mb-4">
            De Royal Kore
          </h3>

          <div className="flex text-primary mb-4 text-3xl gap-1">
            {"★★★★★".split("").map((star, i) => (
              <span key={i} className="drop-shadow-sm">{star}</span>
            ))}
          </div>

          <p className="text-gray-500 text-lg mb-10 font-medium">
            260+ Verified Google Reviews
          </p>

          <GlossyButton className="w-full !py-5 !text-[14px]">
            WRITE A REVIEW
          </GlossyButton>
        </div>

        {/* Right Section */}
        <div className="w-full flex flex-col lg:w-2/3">
          {/* Header */}
          <div className="text-left mb-12">
            <p className="text-primary font-bold tracking-[4px] text-sm uppercase mb-3">
              Clients Testimonials
            </p>

            <h2 className="text-slate-950 text-4xl md:text-5xl lg:text-6xl font-bold relative inline-block pb-6 leading-tight">
              Client Experiences at<br/>De Royal Kore
              <span className="absolute bottom-0 left-0 w-32 h-2 bg-primary rounded-full"></span>
            </h2>
          </div>

          <div className="relative group w-full overflow-visible">
            {/* Left Navigation Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-950 border border-gray-100 hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex scale-90 hover:scale-100"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Navigation Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-950 border border-gray-100 hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex scale-90 hover:scale-100"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Scroll Container */}
            <div
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 pt-4 px-4 -mx-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((review) => (
                <div
                  key={review.id}
                  className="w-[320px] md:w-[480px] shrink-0 bg-white/90 backdrop-blur-sm p-10 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 border border-primary/10 snap-center relative flex flex-col hover:-translate-y-2"
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-5 mb-6">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xl text-slate-950">
                          {review.name}
                        </h4>

                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Color_Icon.svg"
                          className="w-6 h-6"
                          alt="Google"
                        />
                      </div>

                      <p className="text-gray-400 text-sm mt-1 font-medium">
                        {review.date}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-6 bg-gray-50/50 w-max px-3 py-1.5 rounded-full border border-gray-100">
                    <div className="flex text-primary text-base gap-0.5">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>

                    <span className="bg-blue-100 p-1 rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    </span>
                  </div>

                  {/* Review */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic flex-1">
                    "{review.text}"
                  </p>

                  <button className="text-primary font-bold text-sm hover:text-slate-900 transition-colors uppercase tracking-widest mt-auto self-start flex items-center gap-2 group/btn">
                    Read full review
                    <span className="material-symbols-outlined text-lg transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;