import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, Timestamp, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';

const SuccessPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id') || location.state?.orderId;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyPaymentAndUpdateOrder = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return;
                }

                if (!orderId) {
                    throw new Error('Order ID not found');
                }

                // Verify the Stripe session if sessionId exists
                if (sessionId) {
                    const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
                    const sessionData = await response.json();

                    if (sessionData.payment_status !== 'paid') {
                        throw new Error('Payment not completed');
                    }
                }

                // Update order status in Firestore
                const orderRef = doc(db, 'orders', orderId);
                const orderSnap = await getDoc(orderRef);

                if (!orderSnap.exists()) {
                    throw new Error('Order not found');
                }

                await updateDoc(orderRef, {
                    status: 'completed',
                    paymentStatus: 'paid',
                    paymentSessionId: sessionId,
                    updatedAt: Timestamp.now(),
                });

            } catch (err) {
                console.error('Order verification failed:', err);
                setError(err instanceof Error ? err.message : 'Payment verification failed');
                navigate('/checkout/failed', { state: { error: 'Payment verification failed' } });
            } finally {
                setLoading(false);
            }
        };

        verifyPaymentAndUpdateOrder();
    }, [orderId, sessionId, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Verifying your payment...</h2>
                    <p>Please wait while we confirm your order.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-red-600">Payment Verification Failed</h2>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Return to Checkout
                    </button>
                </div>
            </div>
        );
    }

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