
import { X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const CartDrawer = () => {
    const { isOpen, toggleCart, cart, removeFromCart, increaseQty, decreaseQty, total } = useCartStore();

    return (
        <div
            className={`fixed top-0 right-0 h-full w-64 md:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">Your Cart</h2>
                <button onClick={toggleCart}>
                    <X />
                </button>
            </div>

            <div className="p-4 space-y-4 h-[calc(100%-120px)] overflow-y-auto">
                {cart.length === 0 ? (
                    <p className="text-center text-gray-500">Your cart is empty.</p>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                            <img src={item.image} className="w-16 h-16 rounded object-cover" />
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p>${item.price.toFixed(2)}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <button
                                        onClick={() => decreaseQty(item.id)}
                                        className="px-2 border rounded"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQty(item.id)}
                                        className="px-2 border rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t">
                <p className="text-lg font-bold">Subtotal: ${total().toFixed(2)}</p>
                <button className="mt-4 w-full bg-black text-white py-2 rounded">
                    Checkout
                </button>
            </div>
        </div>
    );
};
