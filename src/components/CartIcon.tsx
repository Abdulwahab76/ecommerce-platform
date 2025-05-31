import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const CartIcon = () => {
    const { cart, toggleCart } = useCartStore();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="relative cursor-pointer" onClick={toggleCart}>
            <ShoppingCart className="w-6 h-6" />
            {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {count}
                </span>
            )}
        </div>
    );
};
