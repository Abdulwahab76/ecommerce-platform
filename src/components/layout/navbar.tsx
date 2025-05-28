import { AlignJustify, CircleUser, Search, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
    { label: 'Shop', href: '/shop' },
    { label: 'On Sale', href: '/on-sale' },
    { label: 'New Arrival', href: '/new-arrival' },
    { label: 'Brands', href: '/brands' },
];

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [toggleSearch, setToggleSearch] = useState(false);
    const navigate = useNavigate();

    const { user, isAdmin } = useAuth();
    const [toggleDropDown, setToggleDropDown] = useState(false)
    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };
    const routes = ['/admin', '/user', '/login', '/register', 'verify-email']
    const specificRoute = routes.find(route => window.location.pathname.includes(route));
    console.log(user, 'log');

    return (
        <nav className="bg-white px-2 md:px-10">
            <div className="flex w-full h-24 justify-between items-center px-4">
                {/* Logo & Mobile Menu Toggle */}
                <div className='flex items-center gap-x-2'>
                    <button
                        className="lg:hidden flex items-center ml-4"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {!isMobileMenuOpen ? <AlignJustify /> : <X />}
                    </button>

                    <a href="/">
                        <h1 className="font-bold font-integral text-2xl">SHOP.CO</h1>
                    </a>

                </div>

                {/* Desktop Links */}
                {!specificRoute && <div className="hidden lg:flex gap-5 text-lg">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="hover:text-gray-600 whitespace-nowrap"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>}

                {/* Search Bar */}
                {!specificRoute && <div
                    className={`${toggleSearch ? 'flex w-10/12' : 'hidden'} 
                        w-6/12 ${!toggleSearch ? 'lg:flex' : ''} 
                        ${toggleSearch ? 'absolute top-26 max-w-full px-4' : ''}`}
                >
                    <div className="flex bg-white md:bg-gray-100 w-full h-12 items-center gap-x-2 px-3 rounded-full">
                        <Search className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search everything"
                            className="outline-none bg-transparent w-full"
                        />
                    </div>
                </div>}

                {/* Icons and Authentication Links */}
                <div className="flex gap-x-2 items-center">
                    <Search className="md:hidden block" onClick={() => setToggleSearch(!toggleSearch)} />
                    <ShoppingCart className="cursor-pointer" />

                    {/* 🔓 Authentication Buttons */}
                    {user ? (
                        <div className="relative">
                            <button
                                className="cursor-pointer px-3 py-1 rounded-md"
                                onClick={() => setToggleDropDown(!toggleDropDown)}>
                                <CircleUser />
                            </button>
                            {toggleDropDown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                                    <ul className="py-1">

                                        <li>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                onClick={() => { navigate(isAdmin ? "/admin" : "/user"); setToggleDropDown(false); }}
                                            >
                                                Profile
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                className="bg-white shadow cursor-pointer text-black px-4 py-2 rounded-md md:block hidden"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                            <button
                                className="bg-gray-700 text-white px-4 py-2 cursor-pointerP rounded-md ml-2 md:block hidden"
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </button>
                        </>
                    )}
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
                            <>
                                <button
                                    className="bg-white shadow cursor-pointer text-black px-4 py-2 rounded-md md:hidden block"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>
                                <button
                                    className="bg-gray-700 text-white px-4 py-2 cursor-pointerP rounded-md md:hidden block"
                                    onClick={() => navigate("/register")}
                                >
                                    Register
                                </button>
                            </>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
