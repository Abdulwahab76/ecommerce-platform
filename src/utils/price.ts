// utils/price.ts
export const calculateDiscountedPrice = (price: number, discountPercent: number | null): number => {
    if (!discountPercent || discountPercent <= 0) {
        return price;
    }
    return parseFloat((price - (price * discountPercent) / 100).toFixed(2));
};
