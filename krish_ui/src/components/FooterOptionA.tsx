import { useState, type FormEvent, type SVGProps } from "react";
import "./FooterOptionA.css";

type IconProps = SVGProps<SVGSVGElement>;

function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function ArrowUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="m12 19 0-14" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function SendIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function GoldCurve() {
  return (
    <div className="footer-curve" aria-hidden="true">
      <div className="footer-curve__glow" />
      <div className="footer-curve__outer" />
      <div className="footer-curve__inner" />
      <div className="footer-curve__hairline" />
      <div className="footer-curve__diamond" />
    </div>
  );
}

const treatmentLinks = ["Korean Facials", "Clear Skin Therapy", "Hydra Infusion", "Gold Infusion Facial"];
const studioLinks = ["About", "Rituals", "Results", "Journal"];

export default function FooterOptionA() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim().length > 3) {
      setJoined(true);
      setEmail("");
    }
  };

  return (
    <footer className="footer-option-a">
      <GoldCurve />
      <span className="footer-option-a__spark" />
      <span className="footer-option-a__spark-alt" />

      <div className="footer-option-a__wrap">
        <div className="footer-option-a__top">
          <div>
            <a href="#top" className="footer-option-a__brand" aria-label="DeRoyalKore home">
              <span className="footer-option-a__monogram">D</span>
              <span className="footer-option-a__wordmark">
                DeRoyal<span className="footer-option-a__gold-text">Kore</span>
              </span>
            </a>

            <p className="footer-option-a__intro">
              Advanced skin rituals, Korean facial therapies, and restorative aesthetic care shaped with clinical precision in Panipat and Karnal.
            </p>

            <div className="footer-option-a__status">
              <span className="footer-option-a__pulse" />
              <span>Now accepting appointments</span>
            </div>
          </div>

          <div className="footer-option-a__newsletter">
            <p className="footer-option-a__eyebrow">The Inner Circle</p>
            <h3 className="footer-option-a__title">
              Seasonal rituals and private previews, <em>quietly delivered.</em>
            </h3>

            {joined ? (
              <div className="footer-option-a__success" role="status">
                <CheckIcon />
                <span>Welcome to the circle. Watch for our next letter.</span>
              </div>
            ) : (
              <form className="footer-option-a__form" onSubmit={handleJoin}>
                <label className="footer-option-a__field">
                  <span className="sr-only">Email address</span>
                  <MailIcon />
                  <input
                    className="footer-option-a__input"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Your email address"
                  />
                </label>
                <button className="footer-option-a__button" type="submit">
                  <span>Join</span>
                  <SendIcon />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-option-a__columns">
          <div>
            <p className="footer-option-a__heading">Treatments</p>
            <ul className="footer-option-a__list">
              {treatmentLinks.map((item) => (
                <li key={item}>
                  <a className="footer-option-a__link" href="#treatments">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-option-a__heading">Studio</p>
            <ul className="footer-option-a__list">
              {studioLinks.map((item) => (
                <li key={item}>
                  <a className="footer-option-a__link" href={`#${item.toLowerCase()}`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-option-a__locations-col">
            <p className="footer-option-a__heading">Visit the Ateliers</p>
            <div className="footer-option-a__locations">
              <div className="footer-option-a__location">
                <PinIcon />
                <div>
                  <p className="footer-option-a__location-title">Panipat - Flagship</p>
                  <p className="footer-option-a__location-copy">GT Road, Sector 14</p>
                </div>
              </div>

              <div className="footer-option-a__location">
                <PinIcon />
                <div>
                  <p className="footer-option-a__location-title">Karnal - Atelier</p>
                  <p className="footer-option-a__location-copy">Model Town, Main Road</p>
                </div>
              </div>

              <div className="footer-option-a__location">
                <ClockIcon />
                <p className="footer-option-a__location-copy">
                  Tue - Sun | 10:00 - 20:00
                  <br />
                  Appointments by consultation only
                </p>
              </div>
            </div>
          </div>

          <div className="footer-option-a__connect-col">
            <p className="footer-option-a__heading">Connect</p>
            <a className="footer-option-a__contact-card mb-3" href="mailto:krisharora3406@gmail.com">
              <span>
                <span className="footer-option-a__contact-label">Begin your ritual</span>
                <span className="footer-option-a__contact-email">krisharora3406@gmail.com</span>
              </span>
              <ArrowUpRightIcon />
            </a>
            <a className="footer-option-a__contact-card" href="tel:7988106343">
              <span>
                <span className="footer-option-a__contact-label">Phone &amp; WhatsApp</span>
                <span className="footer-option-a__contact-email">+91 79881 06343</span>
              </span>
              <ArrowUpRightIcon />
            </a>

            <div className="footer-option-a__socials mt-4">
              <a className="footer-option-a__social" href="deroyalkore.wholesale" aria-label="Instagram"><InstagramIcon /></a>
              <a className="footer-option-a__social" href="mailto:krisharora3406@gmail.com" aria-label="Email"><MailIcon /></a>
              <a className="footer-option-a__social" href="#visit" aria-label="Directions"><PinIcon /></a>
            </div>
          </div>
        </div>

        <div className="footer-option-a__rule" />

        <div className="footer-option-a__bottom">
          <p className="footer-option-a__copyright">Copyright 2026 DeRoyalKore</p>
          <p className="footer-option-a__signature">Gold-Standard Skin Rituals</p>
          <button
            className="footer-option-a__to-top"
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>
    </footer>
  );
}