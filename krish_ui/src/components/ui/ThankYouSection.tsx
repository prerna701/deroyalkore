type ThankYouSectionProps = {
  onContactClick: () => void;
}

const ThankYouSection = ({ onContactClick }: ThankYouSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-[#050403] px-4 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.18),transparent_28%),linear-gradient(180deg,#050403_0%,#0b0704_100%)]" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-[#090704] p-[1px] shadow-[0_32px_90px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,rgba(212,175,55,0.18),rgba(246,226,122,0.5),rgba(212,175,55,0.14))]" />

          <div className="relative rounded-2xl bg-[#050403]/90 px-6 py-14 text-center backdrop-blur-md transition-all duration-500 md:px-14 md:py-16">
            <div className="absolute inset-5 rounded-xl border border-primary/10 pointer-events-none" />

            <div className="mx-auto mb-6 flex w-max max-w-full items-center justify-center gap-4 border border-primary/20 bg-primary/5 px-5 py-3">
              <span className="h-px w-8 bg-primary/50" />
              <h2 className="font-sans text-3xl font-semibold tracking-normal text-cream md:text-5xl">
                Thank You for <span className="text-primary">Visiting</span>
              </h2>
              <span className="h-px w-8 bg-primary/50" />
            </div>

            <p className="mx-auto mb-10 max-w-2xl text-sm italic leading-7 text-cream/60 md:text-base">
              "Your presence defines our purpose. Connect with us to begin your journey."
            </p>

            <button
              onClick={onContactClick}
              className="relative inline-flex items-center gap-3 overflow-hidden bg-primary px-8 py-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[#120d04] shadow-[0_18px_48px_rgba(212,175,55,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4 focus:ring-offset-[#050403]"
            >
              <span className="relative">Contact Us</span>
              <span className="material-symbols-outlined text-base">east</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThankYouSection;
