const ShopCoLoader = () => {
    return (
        <div className="flex justify-center items-center  h-screen bg-gray-100 overflow-hidden">
            <h1 className="relative text-5xl font-extrabold text-gray-800">
                SHOP.CO
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer pointer-events-none" />
            </h1>

            <style>
                {`
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                    .animate-shimmer {
                        animation: shimmer 2s infinite linear;
                        background-size: 200% 100%;
                    }
                `}
            </style>
        </div>
    );
};

export default ShopCoLoader;
