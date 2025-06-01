import { CircleCheckBig } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <div className="bg-white shadow-lg rounded-lg p-10 max-w-md text-center">
                <div className="mb-6 flex justify-center items-center">
                    <CircleCheckBig size={40} className="text-gray-800" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
                    Order Placed Successfully!
                </h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your purchase. Your order is being processed and you'll
                    receive a confirmation email shortly.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-white hover:text-black transition"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default SuccessPage;
