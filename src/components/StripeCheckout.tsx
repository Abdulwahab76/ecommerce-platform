import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';

const StripeCheckout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.pathname.split('/')[3];

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return;
                }

                const orderRef = doc(db, 'orders', orderId);
                const orderSnap = await getDoc(orderRef);

                if (!orderSnap.exists()) {
                    throw new Error('Order not found');
                }

                // const orderData = orderSnap.data();

                // Here you would typically verify the payment with Stripe
                // For now, we'll just simulate success
                navigate('/success', { state: { orderId } });
            } catch (error) {
                console.error('Payment verification failed:', error);
                navigate('/checkout/failed');
            }
        };

        verifyPayment();
    }, [orderId, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Processing Payment...</h2>
                <p>Please wait while we verify your payment.</p>
            </div>
        </div>
    );
};

export default StripeCheckout;