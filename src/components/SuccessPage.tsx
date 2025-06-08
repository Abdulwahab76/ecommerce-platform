import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';

const SuccessPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // const sessionId = searchParams.get('session_id');
    const orderId = location.state?.orderId;

    useEffect(() => {
        const updateOrderStatus = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return;
                }

                if (orderId) {
                    const orderRef = doc(db, 'orders', orderId);
                    await updateDoc(orderRef, {
                        status: 'completed',
                        paymentStatus: 'paid',
                        updatedAt: Timestamp.now(),
                    });
                }
            } catch (error) {
                console.error('Failed to update order status:', error);
            }
        };

        updateOrderStatus();
    }, [orderId, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Order Confirmed!</h2>
                <p className="mb-4">Thank you for your purchase.</p>
                {orderId && (
                    <p className="text-sm text-gray-600 mb-4">
                        Your order ID: <span className="font-mono">{orderId}</span>
                    </p>
                )}
                <button
                    onClick={() => navigate('/')}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;