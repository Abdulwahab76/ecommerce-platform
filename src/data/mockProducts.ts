// src/data/mockProducts.ts
export type ProductType = {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
};

export const mockProducts: ProductType[] = [
    // 👚 Shirts
    {
        id: "1",
        name: "Classic White Shirt",
        price: 29.99,
        category: "Shirts",
        image: "https://mms-images-prod.imgix.net/mms/images/catalog/6a62c76ef0978853a20391b6c32da4fe/colors/176100/views/alt/front_large_extended.png?dpr=1.2&auto=format&nrs=0&w=600",
    },
    {
        id: "2",
        name: "Denim Blue Shirt",
        price: 35.99,
        category: "Shirts",
        image: "https://via.placeholder.com/300x200?text=Denim+Blue+Shirt",
    },
    {
        id: "3",
        name: "Plaid Flannel Shirt",
        price: 27.99,
        category: "Shirts",
        image: "https://via.placeholder.com/300x200?text=Plaid+Flannel+Shirt",
    },

    // 👖 Pants
    {
        id: "4",
        name: "Slim Fit Jeans",
        price: 49.99,
        category: "Pants",
        image: "https://via.placeholder.com/300x200?text=Slim+Fit+Jeans",
    },
    {
        id: "5",
        name: "Chinos Khaki",
        price: 39.99,
        category: "Pants",
        image: "https://via.placeholder.com/300x200?text=Chinos+Khaki",
    },
    {
        id: "6",
        name: "Jogger Sweatpants",
        price: 25.99,
        category: "Pants",
        image: "https://via.placeholder.com/300x200?text=Jogger+Sweatpants",
    },

    // 🧥 Jackets
    {
        id: "7",
        name: "Leather Jacket",
        price: 89.99,
        category: "Jackets",
        image: "https://via.placeholder.com/300x200?text=Leather+Jacket",
    },
    {
        id: "8",
        name: "Winter Parka",
        price: 129.99,
        category: "Jackets",
        image: "https://via.placeholder.com/300x200?text=Winter+Parka",
    },
    {
        id: "9",
        name: "Denim Jacket",
        price: 59.99,
        category: "Jackets",
        image: "https://via.placeholder.com/300x200?text=Denim+Jacket",
    },

    // 👟 Shoes
    {
        id: "10",
        name: "Running Sneakers",
        price: 75.99,
        category: "Shoes",
        image: "https://via.placeholder.com/300x200?text=Running+Sneakers",
    },
    {
        id: "11",
        name: "Leather Boots",
        price: 99.99,
        category: "Shoes",
        image: "https://via.placeholder.com/300x200?text=Leather+Boots",
    },
    {
        id: "12",
        name: "Canvas Sneakers",
        price: 45.99,
        category: "Shoes",
        image: "https://via.placeholder.com/300x200?text=Canvas+Sneakers",
    },
];
