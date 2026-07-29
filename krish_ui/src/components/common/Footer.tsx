const Footer = () => {
    return (
        <footer className="relative overflow-hidden bg-[#050403]">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent shadow-[0_0_22px_rgba(212,175,55,0.45)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(212,175,55,0.12),transparent_24%),radial-gradient(circle_at_86%_70%,rgba(125,78,24,0.2),transparent_30%)]" />

            <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-10 pt-20 md:px-10 md:pt-24">
                <div className="grid grid-cols-1 gap-10 border-b border-primary/10 pb-14 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.35fr_0.9fr_0.9fr_1fr]">
                    <div className="space-y-5">
                        <h3 className="font-sans text-4xl font-semibold text-primary">
                            DRoyalCore
                        </h3>
                        <p className="max-w-sm text-sm leading-7 text-cream/60">
                            Advanced skin rituals, Korean facial therapies, and restorative aesthetic care shaped with clinical precision.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.34em] text-primary">Treatments</h4>
                        <nav className="flex flex-col space-y-3 text-xs font-medium uppercase tracking-[0.18em] text-cream/60">
                            <a href="/treatment/korean-facials" className="transition-colors hover:text-primary">Korean Facials</a>
                            <a href="/treatment/acne-treatment" className="transition-colors hover:text-primary">Clear Skin Therapy</a>
                            <a href="/treatment/hydra-facials" className="transition-colors hover:text-primary">Hydra Infusion</a>
                        </nav>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.34em] text-primary">Studio</h4>
                        <nav className="flex flex-col space-y-3 text-xs font-medium uppercase tracking-[0.18em] text-cream/60">
                            <a href="#" className="transition-colors hover:text-primary">About</a>
                            <a href="/treatments" className="transition-colors hover:text-primary">Rituals</a>
                            <a href="/results" className="transition-colors hover:text-primary">Results</a>
                        </nav>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.34em] text-primary">Visit</h4>
                        <p className="text-sm leading-7 text-cream/60">
                            Panipat and Karnal skin clinic appointments by consultation.
                        </p>
                        <div className="flex justify-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary sm:justify-start">
                            <a href="#" className="transition-colors hover:text-cream">Instagram</a>
                            <a href="#" className="transition-colors hover:text-cream">Contact</a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 text-center text-[9px] uppercase tracking-[0.3em] text-cream/30 md:flex-row md:items-center md:justify-between md:text-left">
                    <p>Copyright 2026 DRoyalCore</p>
                    <p>Gold-standard skin rituals</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
