import { AlignJustify, CircleUser, Search, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
    { label: 'Shop', href: '/shop' },
    { label: 'On Sale', href: '/on-sale' },
    { label: 'New Arrival', href: '/new-arrival' },
    { label: 'Brands', href: '/brands' },
];

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [toggleSearch, setToggleSearch] = useState(false);

    return (
        <nav className="bg-white  px-2 md:px-10">
            <div className="flex w-full h-24 justify-between items-center px-4 ">
                {/* Logo */}
                <div className='flex items-center gap-x-2'>
                    <button
                        className="lg:hidden flex items-center ml-4"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {!isMobileMenuOpen ? <AlignJustify /> : <X />}
                    </button>

                    <a href="/dashboard">
                        <h1 className="font-bold font-integral text-2xl">SHOP.CO</h1>
                    </a>
                </div>

                {/* Desktop Links */}
                <div className="hidden lg:flex gap-5 text-lg">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="hover:text-gray-600 whitespace-nowrap"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Search Bar */}
                <div
                    className={` ${toggleSearch ? 'flex w-10/12 *:rounded-none' : 'hidden'}  w-6/12 ${!toggleSearch ? 'lg:flex' : ''}   ${toggleSearch ? 'absolute top-26 max-w-full px-4' : ''}
  `}
                >
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
                    <Search className=" md:hidden block" onClick={() => setToggleSearch(!toggleSearch)} />
                    <ShoppingCart className="cursor-pointer" />
                    <CircleUser className="cursor-pointer" />
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-24 left-0 w-full bg-white shadow-lg lg:hidden">
                        <ul className="flex flex-col items-start p-4 space-y-3">
                            {NAV_LINKS.map((link) => (
                                <li key={link.label} className="w-full">
                                    <a
                                        href={link.href}
                                        className="block w-full p-2 text-lg hover:bg-gray-100"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                    </div>
                )}
            </div>

        </nav>
    );
};

export default Navbar;