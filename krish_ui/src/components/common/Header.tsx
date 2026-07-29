import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<'collections' | 'treatments' | null>(null);
    const navigate = useNavigate();

    const navLinks = [
        {
            name: 'Treatments',
            id: 'treatments',
            path: '/treatments',
            items: [
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
                { name: 'Intimate Area Whitening', path: '/treatment/intimate-whitening' }
            ]
        },
        { name: 'Gallery', href: '/gallery', type: 'link' },
        { name: 'Results', href: '/results', type: 'link' },
        { name: 'Pricing', href: '/pricing', type: 'link' },
        { name: 'Offers', href: '/offers', type: 'link' },
        { name: 'About', href: '/about', type: 'link' },
        { name: 'AI Analysis', href: '/ai-analysis', type: 'link' },
        { name: 'Contact', href: '/contact', type: 'link' }
    ];

    const handleNavigation = (path: string) => {
        if (path !== '#') {
            navigate(path);
            setIsDropdownOpen(null);
        }
    };

    return (
        <header className="bg-gradient-to-br from-[#3A2D23] to-[#050403] border-b border-[#a68a4c]/20 sticky top-0 z-50 relative">
            {/* Fixed bottom border */}
            <div
                className="absolute bottom-0 left-0 w-full h-[3px]"
                style={{
                    background: 'linear-gradient(90deg, transparent, #3A2D23, #a68a4c, #3A2D23, transparent)',
                }}
            />
            <div className="w-full mx-auto px-8 py-6 flex items-center justify-between">

                {/* Logo Section */}
                <div
                    onClick={() => handleNavigation('/')}
                    className="flex flex-col cursor-pointer"
                >
                    <h1 className="text-[#EADBCA] font-serif text-3xl font-semibold leading-tight tracking-wide">
                        D Royal Core
                    </h1>
                    <span className="text-[#EADBCA] font-serif text-sm font-semibold tracking-widest text-center mt-[-4px]">
                        Skin Rituals
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="hidden lg:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative group"
                            onMouseEnter={() => link.id && setIsDropdownOpen(link.id as any)}
                            onMouseLeave={() => setIsDropdownOpen(null)}
                        >
                            {link.id ? (
                                /* Treatments with dropdown arrow */
                                <div
                                    className="flex items-center gap-1 cursor-pointer relative after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#a68a4c] after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                                    onClick={() => link.path && handleNavigation(link.path)}
                                >
                                    <span className="text-[#a68a4c] font-medium text-sm tracking-widest uppercase transition-colors duration-300 hover:opacity-70">
                                        {link.name}
                                    </span>
                                    <svg className="w-3 h-3 text-[#a68a4c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                    </svg>
                                </div>
                            ) : (
                                /* Regular nav links */
                                <a
                                    href={link.href || '#'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (link.href) handleNavigation(link.href);
                                    }}
                                    className="text-[#EADBCA] font-medium text-sm tracking-widest uppercase transition-colors duration-300 hover:text-[#a68a4c] relative after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-[#a68a4c] after:transition-transform after:duration-300 group-hover:after:scale-x-100"
                                >
                                    {link.name}
                                </a>
                            )}

                            {/* Dropdown Menu */}
                            {link.id && isDropdownOpen === link.id && (
                                <div className="absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 border border-[#a68a4c]/20 bg-[#FFFDF9] py-5 shadow-[0_20px_60px_rgba(43,31,18,.12)] z-50">
                                    <div className="space-y-1">
                                        {link.items?.map((item) => (
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

                {/* Utility Icons */}
                <div className="hidden md:flex items-center space-x-5">
                    {/* Search */}
                    <button className="text-[#a68a4c] hover:opacity-70 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                    </button>

                    {/* Shopping Bag */}
                    <button className="text-[#a68a4c] relative hover:opacity-70 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                        <span className="absolute -top-1 -right-1.5 bg-[#a68a4c] text-white rounded-full w-4 h-4 flex items-center justify-center text-[0.6rem] font-bold">
                            3
                        </span>
                    </button>

                    {/* User Profile */}
                    <button className="text-[#a68a4c] hover:opacity-70 transition-opacity">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="flex h-10 w-10 items-center justify-center text-[#a68a4c] hover:opacity-70 transition-opacity lg:hidden">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                </button>

            </div>
        </header>
    );
};

export default Header;
