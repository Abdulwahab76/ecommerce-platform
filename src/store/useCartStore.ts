// store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
};

type CartStore = {
    cart: CartItem[];
    isOpen: boolean;
    toggleCart: () => void;
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    clearCart: () => void;
    total: () => number;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: [],
            isOpen: false,

            toggleCart: () =>
                set((state) => ({ isOpen: !state.isOpen })),

            addToCart: (item) => {
                const { cart } = get();
                const exists = cart.find((p) => p.id === item.id);
                if (exists) {
                    set({
                        cart: cart.map((p) =>
                            p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                        ),
                    });
                } else {
                    set({ cart: [...cart, { ...item, quantity: 1 }] });
                }
            },

            removeFromCart: (id) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== id),
                })),

            increaseQty: (id) =>
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                })),

            decreaseQty: (id) =>
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.id === id && item.quantity > 1
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    ),
                })),

            clearCart: () => set({ cart: [] }),

            total: () =>
                get().cart.reduce(
                    (sum, item) => sum + item.quantity * item.price,
                    0
                ),
        }),
        {
            name: 'cart-storage', // key in localStorage
            partialize: (state) => ({ cart: state.cart }), // only persist cart
        }
    )
);
