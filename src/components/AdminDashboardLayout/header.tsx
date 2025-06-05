import { CartDrawer } from "../CartDrawer";
import { CartIcon } from "../CartIcon";

interface HeaderProps {
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <div className="flex items-center justify-between bg-white p-6 shadow-md">
            <div className="flex gap-x-4 items-center">

                <button className="md:hidden  " onClick={onMenuClick}>
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>

                </button>
                <a href="/">
                    <h1 className="font-bold font-integral text-2xl">SHOP.CO</h1>
                </a>
            </div>

            <CartIcon />
            <CartDrawer />
        </div>
    );
};

export default Header;
