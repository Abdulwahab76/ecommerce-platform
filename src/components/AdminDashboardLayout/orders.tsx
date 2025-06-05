import React, { useState } from "react";
import { useOrders, type Order } from "../../hooks/useOrders";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../services/authService";

const Orders: React.FC = () => {
    const { orders, loading, error, deleteOrder } = useOrders();
    const { user } = useAuth();

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    if (!isAdmin(user?.email)) {
        return <div className="text-red-500 p-4">You are not authorized to manage products.</div>;
    }
    return (
        <div className="p-4 bg-white rounded shadow-md overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>

            {loading && <p>Loading orders...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <div className="w-full overflow-auto">
                    <table className="min-w-[800px] w-full text-sm border border-collapse">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-2 border">Customer</th>
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">City</th>
                                <th className="p-2 border">Country</th>
                                <th className="p-2 border">Total</th>
                                <th className="p-2 border">Items</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center text-gray-500 py-4">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                            {orders.map(order => (
                                <tr key={order.id} className="border-t hover:bg-gray-50">
                                    <td className="p-2 border">{order.name}</td>
                                    <td className="p-2 border">{order.email}</td>
                                    <td className="p-2 border">{order.city}</td>
                                    <td className="p-2 border">{order.country}</td>
                                    <td className="p-2 border">PKR {order.total}</td>
                                    <td className="p-2 border">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td className="p-2 border space-x-2">
                                        <button
                                            onClick={() => deleteOrder(order.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal: Order Items */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                        <h3 className="text-xl font-semibold mb-3">Order Items</h3>
                        <ul className="divide-y">
                            {selectedOrder.items.map((item, index) => (
                                <li key={index} className="py-2 flex justify-between">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            Qty: {item.quantity} × PKR {item.discountedPrice}
                                        </p>
                                    </div>
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="text-right mt-4">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
