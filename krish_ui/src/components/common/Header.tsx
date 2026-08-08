import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type DropdownId = 'treatments';

interface TreatmentNavItem {
    name: string;
    path: string;
}

interface DropdownNavLink {
    name: string;
    id: DropdownId;
    path: string;
    items: TreatmentNavItem[];
}

interface StandardNavLink {
    name: string;
    href: string;
    type: 'link';
}

type NavLink = DropdownNavLink | StandardNavLink;

const treatmentNavItems: TreatmentNavItem[] = [
    { name: 'Pigmentation & Melasma', path: '/treatment/pigmentation' },
    { name: 'Korean Glass Skin', path: '/treatment/korean-glass-skin' },
    { name: 'Permanent Whitening', path: '/treatment/permanent-whitening' },
    { name: 'Tanning Removal', path: '/treatment/tanning-removal' },
    { name: 'Acne Removal', path: '/treatment/acne-removal' },
    { name: 'Open Pores', path: '/treatment/open-pores' },
    { name: 'Uneven Skin Tone', path: '/treatment/uneven-skin-tone' },
    { name: 'Blemishes Removal', path: '/treatment/blemishes-removal' },
    { name: 'Body Pigmentation', path: '/treatment/body-pigmentation' },
    { name: 'Body Whitening & Glow', path: '/treatment/body-whitening' },
    { name: 'Intimate Area Whitening', path: '/treatment/intimate-whitening' },
];

const navLinks: NavLink[] = [
    {
        name: 'Treatments',
        id: 'treatments',
        path: '/treatments',
        items: treatmentNavItems,
    },
    { name: 'Gallery', href: '/gallery', type: 'link' },
    { name: 'Results', href: '/results', type: 'link' },
    { name: 'Pricing', href: '/pricing', type: 'link' },
    { name: 'Offers', href: '/offers', type: 'link' },
    { name: 'About', href: '#contact', type: 'link' },
    { name: 'AI Analysis', href: '/ai-analysis', type: 'link' },
    { name: 'Contact', href: '#contact', type: 'link' },
];

const isDropdownLink = (link: NavLink): link is DropdownNavLink => 'id' in link;

const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<DropdownId | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isTreatmentsExpanded, setIsTreatmentsExpanded] = useState(false);
    const navigate = useNavigate();

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileOpen]);

    const handleNavigation = (path: string) => {
        if (path !== '#') {
            navigate(path);
            setIsDropdownOpen(null);
            setIsMobileOpen(false);
        }
    };

    const handleStandardLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        event.preventDefault();
        if (href === '#contact') {
            window.dispatchEvent(new Event('open-contact'));
            setIsDropdownOpen(null);
            setIsMobileOpen(false);
            return;
        }
        handleNavigation(href);
    };

    return (
        <>
            <header className="bg-gradient-to-br from-[#3A2D23] to-[#050403] border-b border-[#a68a4c]/20 sticky top-0 z-50">
                {/* Fixed bottom border */}
                <div
                    className="absolute bottom-0 left-0 w-full h-[3px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent, #3A2D23, #a68a4c, #3A2D23, transparent)',
                    }}
                />

                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between">

                    {/* Logo Section */}
                    <div
                        onClick={() => handleNavigation('/')}
                        className="flex flex-col cursor-pointer flex-shrink-0"
                    >
                        <h1 className="text-[#EADBCA] font-serif text-2xl lg:text-3xl font-semibold leading-tight tracking-wide">
                            D Royal Core
                        </h1>
                        <span className="text-[#EADBCA] font-serif text-xs lg:text-sm font-semibold tracking-widest text-center mt-[-4px]">
                            Skin Rituals
                        </span>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <div
                                key={link.name}
                                className="relative group"
                                onMouseEnter={() => isDropdownLink(link) && setIsDropdownOpen(link.id)}
                                onMouseLeave={() => setIsDropdownOpen(null)}
                            >
                                {isDropdownLink(link) ? (
                                    <div
                                        className="flex items-center gap-1 cursor-pointer relative after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#a68a4c] after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                                        onClick={() => handleNavigation(link.path)}
                                    >
                                        <span className="text-[#a68a4c] font-medium text-sm tracking-widest uppercase transition-colors duration-300 hover:opacity-70">
                                            {link.name}
                                        </span>
                                        <svg className="w-3 h-3 text-[#a68a4c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        </svg>
                                    </div>
                                ) : (
                                    <a
                                        href={link.href}
                                        onClick={(event) => handleStandardLinkClick(event, link.href)}
                                        className="text-[#EADBCA] font-medium text-sm tracking-widest uppercase transition-colors duration-300 hover:text-[#a68a4c] relative after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#a68a4c] after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                                    >
                                        {link.name}
                                    </a>
                                )}

                                {/* Desktop Dropdown Menu */}
                                {isDropdownLink(link) && isDropdownOpen === link.id && (
                                    <div className="absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 border border-[#a68a4c]/20 bg-[#FFFDF9] py-5 shadow-[0_20px_60px_rgba(43,31,18,.12)] z-50">
                                        <div className="space-y-1">
                                            {link.items.map((item) => (
                                                <button
                                                    key={item.name}
                                                    onClick={() => handleNavigation(item.path)}
                                                    className="w-full border-l-2 border-transparent px-8 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#333] transition-all duration-300 hover:border-[#a68a4c] hover:bg-[#f2e8d5]/50 hover:text-[#a68a4c]"
                                                >
                                                    {item.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Hamburger Button — mobile/tablet only */}
                    <button
                        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMobileOpen}
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a68a4c]/50 transition-colors duration-200"
                    >
                        <span
                            className={`block w-6 h-0.5 bg-[#EADBCA] transition-all duration-300 ${isMobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-[#EADBCA] my-1.5 transition-all duration-300 ${isMobileOpen ? 'opacity-0 scale-x-0' : ''}`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-[#EADBCA] transition-all duration-300 ${isMobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
                        />
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Slide-in Drawer */}
            <div
                className={`lg:hidden fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-gradient-to-b from-[#3A2D23] to-[#1a1208] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#a68a4c]/20">
                    <span className="text-[#EADBCA] font-serif text-lg font-semibold tracking-wide">Menu</span>
                    <button
                        aria-label="Close menu"
                        onClick={() => setIsMobileOpen(false)}
                        className="text-[#EADBCA] hover:text-[#a68a4c] transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Drawer Nav Items */}
                <nav className="px-4 py-6 space-y-1">
                    {navLinks.map((link) => (
                        <div key={link.name}>
                            {isDropdownLink(link) ? (
                                <>
                                    {/* Treatments accordion */}
                                    <button
                                        onClick={() => setIsTreatmentsExpanded(!isTreatmentsExpanded)}
                                        className="w-full flex items-center justify-between px-4 py-3.5 text-[#a68a4c] font-semibold text-sm tracking-widest uppercase rounded-lg hover:bg-[#a68a4c]/10 transition-colors duration-200"
                                    >
                                        <span>{link.name}</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-300 ${isTreatmentsExpanded ? 'rotate-180' : ''}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        </svg>
                                    </button>

                                    {/* Sub-items */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${isTreatmentsExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="pl-4 py-2 space-y-1 border-l border-[#a68a4c]/30 ml-4">
                                            <button
                                                onClick={() => handleNavigation(link.path)}
                                                className="w-full text-left px-3 py-2 text-[#EADBCA]/70 text-xs font-bold tracking-widest uppercase hover:text-[#a68a4c] transition-colors duration-200"
                                            >
                                                View All Treatments →
                                            </button>
                                            {link.items.map((item) => (
                                                <button
                                                    key={item.name}
                                                    onClick={() => handleNavigation(item.path)}
                                                    className="w-full text-left px-3 py-2.5 text-[#EADBCA]/80 text-sm font-medium hover:text-[#a68a4c] hover:bg-[#a68a4c]/10 rounded-md transition-all duration-200"
                                                >
                                                    {item.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <a
                                    href={link.href}
                                    onClick={(e) => handleStandardLinkClick(e, link.href)}
                                    className="flex items-center px-4 py-3.5 text-[#EADBCA] font-medium text-sm tracking-widest uppercase rounded-lg hover:bg-[#a68a4c]/10 hover:text-[#a68a4c] transition-all duration-200"
                                >
                                    {link.name}
                                </a>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Drawer Footer */}
                <div className="px-6 pt-4 pb-8 border-t border-[#a68a4c]/20 mt-4">
                    <p className="text-[#EADBCA]/40 text-xs tracking-widest text-center uppercase">D Royal Core · Skin Rituals</p>
                </div>
            </div>
        </>
    );
};

export default Header;
