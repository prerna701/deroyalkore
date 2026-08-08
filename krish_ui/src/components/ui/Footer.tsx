export default function Footer() {
  return (
    <div className="relative overflow-hidden bg-[#07060a] text-neutral-200">
      {/* ======== FOOTER ======== */}
      <footer className="relative">
        {/* THICK GOLD CURVE BORDER AT TOP */}
        <div className="relative w-full overflow-hidden">
          {/* The main thick curved gold stroke */}
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-[100px] md:h-[130px] drop-shadow-[0_4px_40px_rgba(201,169,97,0.35)]"
          >
            {/* Thick gold curve path */}
            <path
              d="M0 10 C 360 115, 1080 115, 1440 10"
              strokeWidth="8"
              stroke="url(#goldGradient)"
              strokeLinecap="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            {/* Thinner accent line above */}
            <path
              d="M0 3 C 360 105, 1080 105, 1440 3"
              strokeWidth="1.5"
              stroke="url(#goldFade)"
              strokeLinecap="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="15%" stopColor="#c9a961" />
                <stop offset="50%" stopColor="#e6d28a" />
                <stop offset="85%" stopColor="#c9a961" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="goldFade" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="rgba(212,180,107,0.6)" />
                <stop offset="50%" stopColor="rgba(230,210,138,0.9)" />
                <stop offset="80%" stopColor="rgba(212,180,107,0.6)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
          {/* Gold glow beneath the curve */}
          <div className="absolute -top-2 left-0 right-0 h-16 bg-gradient-to-b from-gold-500/12 to-transparent blur-xl pointer-events-none" />
          {/* Decorative dots on the curve */}
          <div className="absolute top-8 left-[10%] hidden md:flex gap-1">
            {[...Array(7)].map((_, i) => (
              <span
                key={i}
                className="h-1 w-1 rotate-45 bg-gold-500 opacity-60 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <div className="absolute top-8 right-[10%] hidden md:flex gap-1">
            {[...Array(7)].map((_, i) => (
              <span
                key={i}
                className="h-1 w-1 rotate-45 bg-gold-500 opacity-60 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
        {/* FOOTER BODY */}
        <div className="relative border-t border-gold-500/10 bg-noir-950 pt-24 pb-14">
          {/* Subtle radial glow in the background */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(212,180,107,0.06),transparent_70%)]" />
          <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
            {/* Top row — Brand + Links */}
            <div className="grid gap-14 md:grid-cols-12">
              {/* Brand Column */}
              <div className="md:col-span-5">
                <a href="#" className="inline-flex items-center gap-3 group">
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/40 bg-noir-900 transition-all duration-500 group-hover:border-gold-500/80">
                    <span className="font-sans text-gold-300 text-xl">D</span>
                  </span>
                  <span className="font-sans text-2xl tracking-wide text-neutral-100">
                    DRoyal<span className="text-gold-400">Core</span>
                  </span>
                </a>
                <p className="mt-6 max-w-sm text-base leading-relaxed text-neutral-400 font-sans">
                  Advanced skin rituals, Korean facial therapies, and restorative
                  aesthetic care shaped with clinical precision.
                </p>
                {/* Social icons */}
                <div className="mt-8 flex gap-3">
                  {[
                    { label: "IG", href: "#" },
                    { label: "WA", href: "#" },
                    { label: "LI", href: "#" },
                    { label: "TT", href: "#" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/25 text-[10px] font-semibold uppercase tracking-widest text-gold-400 transition-all duration-300 hover:border-gold-500 hover:bg-gold-500 hover:text-noir-950 hover:scale-110 font-sans"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
              {/* Treatments */}
              <div className="md:col-span-2 md:col-start-7">
                <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-gold-400 mb-7 font-sans">
                  Treatments
                </p>
                <ul className="space-y-4 text-sm text-neutral-400 font-sans">
                  {[
                    { label: "Korean Facials", path: "/treatments" },
                    { label: "Clear Skin Therapy", path: "/treatments" },
                    { label: "Hydra Infusion", path: "/treatments" }
                  ].map(
                    (t) => (
                      <li key={t.label}>
                        <a
                          href={t.path}
                          className="group relative inline-flex items-center gap-2 transition-colors duration-300 hover:text-gold-300"
                        >
                          <span className="h-0 w-0 border-t border-r border-transparent border-solid border-gold-500/0 transition-all duration-300 group-hover:border-gold-500 group-hover:w-1.5 group-hover:h-1.5" />
                          {t.label}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
              {/* Studio */}
              <div className="md:col-span-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-gold-400 mb-7 font-sans">
                  Studio
                </p>
                <ul className="space-y-4 text-sm text-neutral-400 font-sans">
                  {[
                    { label: "About Us", path: "/about" },
                    { label: "Rituals", path: "/treatments" },
                    { label: "Results", path: "/results" },
                    { label: "Offers", path: "/offers" }
                  ].map((t) => (
                    <li key={t.label}>
                      <a
                        href={t.path}
                        className="group relative inline-flex items-center gap-2 transition-colors duration-300 hover:text-gold-300"
                      >
                        <span className="h-0 w-0 border-t border-r border-transparent border-solid border-gold-500/0 transition-all duration-300 group-hover:border-gold-500 group-hover:w-1.5 group-hover:h-1.5" />
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Visit / Contact */}
              <div className="md:col-span-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-gold-400 mb-7 font-sans">
                  Visit &amp; Connect
                </p>
                <p className="text-sm leading-relaxed text-neutral-400 font-sans">
                  Panipat &amp; Karnal clinic appointments.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-neutral-400 font-sans">
                  <li>
                    <a href="tel:7988106343" className="hover:text-gold-300 transition-colors">
                      📞 +91 79881 06343
                    </a>
                  </li>
                  <li>
                    <a href="mailto:krisharora3406@gmail.com" className="hover:text-gold-300 transition-colors">
                      ✉️ krisharora3406@gmail.com
                    </a>
                  </li>
                </ul>
                <div className="mt-5 flex gap-5 text-[11px] font-medium uppercase tracking-[0.25em] text-gold-400 font-sans">
                  <a href="/contact" className="transition-colors duration-300 hover:text-gold-200">
                    Book Online
                  </a>
                </div>
              </div>

              {/* Quick links columns */}
              <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                {/* Treatments */}
                <div>
                  <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-100">
                    Treatments
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <li><a href="/treatments" className="font-sans text-xs text-neutral-500 transition-colors duration-300 hover:text-gold-400">Glass Skin</a></li>
                    <li><a href="/treatments" className="font-sans text-xs text-neutral-500 transition-colors duration-300 hover:text-gold-400">Laser Therapy</a></li>
                    <li><a href="/treatments" className="font-sans text-xs text-neutral-500 transition-colors duration-300 hover:text-gold-400">Anti-Aging</a></li>
                  </ul>
                </div>
                {/* Company */}
                <div>
                  <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-100">
                    Clinic
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <li><a href="/about" className="font-sans text-xs text-neutral-500 transition-colors duration-300 hover:text-gold-400">About Us</a></li>
                    <li><a href="/contact" className="font-sans text-xs text-neutral-500 transition-colors duration-300 hover:text-gold-400">Contact</a></li>
                    <li><a href="/results" className="font-sans text-xs text-neutral-500 transition-colors duration-300 hover:text-gold-400">Verified Results</a></li>
                  </ul>
                </div>
                {/* Timings */}
                <div className="col-span-2 sm:col-span-1">
                  <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-100">
                    Hours
                  </h3>
                  <ul className="mt-6 space-y-4">
                    <li className="font-sans text-xs text-neutral-500">Mon - Sat: 10AM - 7PM</li>
                    <li className="font-sans text-xs text-neutral-500 text-gold-400/80">Sunday: Closed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Accent divider line */}
            <div className="my-16 flex items-center justify-center">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
              <span className="mx-6 text-gold-500/20 text-[9px] uppercase tracking-[0.6em] font-sans">Aurum Rituals</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold-500/30 to-transparent" />
            </div>

            {/* Bottom row — Copyright + Tagline */}
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-500 font-sans">
                  © 2026 DeRoyalKore — All rights reserved
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-700 font-sans">
                  Panipat · Karnal · Haryana
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500/30" />
                <span className="font-sans text-sm italic text-gold-400/80">
                  Gold-Standard Skin Rituals
                </span>
                <span className="h-px w-8 bg-gold-500/30" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
