import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
}

export interface CartStore {
    items: CartItem[];
    isOpen: boolean;

    // Drawer visibility
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;

    // Cart operations
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;

    // Derived state
    getCartTotal: () => number;
    getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            addItem: (item) => set((state) => {
                const existingItem = state.items.find(i => i.id === item.id);
                const quantityToAdd = item.quantity || 1;

                if (existingItem) {
                    return {
                        items: state.items.map(i =>
                            i.id === item.id ? { ...i, quantity: i.quantity + quantityToAdd } : i
                        ),
                        isOpen: true // Automatically slide out the drawer when adding items
                    };
                }

                return {
                    items: [...state.items, { ...item, quantity: quantityToAdd }],
                    isOpen: true
                };
            }),

            removeItem: (id) => set((state) => ({
                items: state.items.filter(i => i.id !== id)
            })),

            updateQuantity: (id, quantity) => set((state) => {
                if (quantity < 1) return { items: state.items };
                return {
                    items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
                };
            }),

            clearCart: () => set({ items: [] }),

            getCartTotal: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            getCartCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            }
        }),
        {
            name: 'biopara-cart-storage', // Key for localStorage
        }
    )
);
