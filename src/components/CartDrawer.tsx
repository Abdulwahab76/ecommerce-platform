import { X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';

export const CartDrawer = () => {
    const { isOpen, toggleCart, cart, removeFromCart, increaseQty, decreaseQty, total } = useCartStore();

    const isCartEmpty = cart.length === 0;

    return (
        <div
            className={`fixed top-0 right-0 h-screen w-64 md:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">Your Cart</h2>
                <button onClick={toggleCart} aria-label="Close cart">
                    <X />
                </button>
            </div>

            <div className="p-4 space-y-4 h-[calc(100%-180px)] overflow-y-auto">
                {isCartEmpty ? (
                    <p className="text-center text-gray-500">Your cart is empty.</p>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p>${item.discountedPrice.toFixed(2)}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <button
                                        onClick={() => decreaseQty(item.id)}
                                        className="px-2 border rounded"
                                        aria-label={`Decrease quantity of ${item.name}`}
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQty(item.id)}
                                        className="px-2 border rounded"
                                        aria-label={`Increase quantity of ${item.name}`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500"
                                aria-label={`Remove ${item.name} from cart`}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="border-t px-3 flex flex-col items-start py-3">
                <p className="text-lg font-bold">Subtotal: ${total().toFixed(2)}</p>

                <Link
                    to="/checkout"
                    className={`mt-4 w-full text-center py-2 rounded border ${isCartEmpty
                        ? 'bg-gray-400 border-gray-400 cursor-not-allowed text-gray-700 pointer-events-none'
                        : 'bg-gray-800 border-gray-800 text-white hover:bg-white hover:text-black transition'
                        }`}
                    tabIndex={isCartEmpty ? -1 : 0}
                    aria-disabled={isCartEmpty}
                >
                    Checkout
                </Link>
            </div>
        </div>
    );
};
