import { AlignJustify, CircleUser, Search, X } from 'lucide-react';
import { useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CartIcon } from '../CartIcon';
import { CartDrawer } from '../CartDrawer';
import ProductSearchDropdown from '../ProductSearch';

const NAV_LINKS = [
    { label: 'Shop', href: '/shop' },
    { label: 'Top Selling', href: '#top-selling' },
    { label: 'New Arrival', href: '#featured' },
    { label: 'Brands', href: '#brands' },
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

    const handleClick = (href: string) => (e: React.MouseEvent) => {
        e.preventDefault();

        if (href.startsWith("/")) {
            // It's a full route, just navigate there
            navigate(href);
        } else if (href.startsWith("#")) {
            // It's a hash link

            if (location.pathname === "/") {
                // On homepage already, scroll smoothly
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            } else {

                navigate(`/${href}`);

            }
        }
    };

    return (
        <nav className="bg-white px-2 md:px-10">
            <div className="flex w-full h-24 justify-between items-center px-4  gap-x-5">
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
                        <Link
                            key={link.label}
                            to={link.href}
                            className="hover:text-gray-600 whitespace-nowrap"
                            onClick={handleClick(link.href)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>}

                {/* Search Bar */}
                {!specificRoute && <ProductSearchDropdown toggleSearch={toggleSearch} />}

                {/* Icons and Authentication Links */}
                <div className="flex gap-x-2 items-center">
                    <Search className="md:hidden block" onClick={() => setToggleSearch(!toggleSearch)} />
                    <CartIcon />

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
            <CartDrawer />

        </nav>
    );
};

export default Navbar;
