import React from "react";
import { useAuth } from "../context/AuthContext";
import { sendVerificationEmail } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (user.emailVerified) {
            navigate("/"); // Or dashboard
        }
    }, [user, navigate]);

    const handleResend = async () => {
        if (!user) return;
        try {
            await sendVerificationEmail(user);
            toast.success("Verification email resent! Check your inbox.");
        } catch {
            toast.error("Failed to resend verification email.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-4 bg-white rounded shadow">
            <h1 className="text-xl font-bold mb-4">Verify Your Email</h1>
            <p>
                A verification email was sent to <strong>{user?.email}</strong>. Please verify your email to
                continue.
            </p>
            <button
                onClick={handleResend}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Resend Verification Email
            </button>
        </div>
    );
};

export default VerifyEmail;
