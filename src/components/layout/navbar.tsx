import { CircleUser, Search, ShoppingCart } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
    { label: 'Shop', href: '/shop' },
    { label: 'On Sale', href: '/on-sale' },
    { label: 'New Arrival', href: '/new-arrival' },
    { label: 'Brands', href: '/brands' },
];

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white  px-10">
            <div className="flex w-full h-24 justify-between items-center p-4 ">
                {/* Logo */}
                <div>
                    <a href="/"> <h1 className="font-bold text-2xl">SHOP.CO</h1></a>

                </div>
                {/* Desktop Links */}
                <div className="hidden md:flex">
                    <ul className="flex gap-5 text-lg">
                        {NAV_LINKS.map((link) => (
                            <li key={link.label}>
                                <a href={link.href} className="hover:text-gray-600">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Search Bar */}
                <div className="hidden md:flex w-full max-w-3xl">
                    <div className="flex bg-gray-100 w-full h-12 items-center gap-x-2 px-3 rounded-full">
                        <Search className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search everything"
                            className="outline-none bg-transparent w-full"
                        />
                    </div>
                </div>

                {/* Icons */}
                <div className="flex gap-x-3">
                    <ShoppingCart />
                    <CircleUser />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex items-center"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <div className="space-y-1">
                        <span className="block w-6 h-0.5 bg-black"></span>
                        <span className="block w-6 h-0.5 bg-black"></span>
                        <span className="block w-6 h-0.5 bg-black"></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <ul className="flex flex-col gap-4 p-4">
                        {NAV_LINKS.map((link) => (
                            <li key={link.label}>
                                <a href={link.href} className="block text-lg hover:text-gray-600">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="p-4">
                        <div className="flex bg-gray-100 w-full h-12 items-center gap-x-2 px-3 rounded-full">
                            <Search className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search everything"
                                className="outline-none bg-transparent w-full"
                            />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;