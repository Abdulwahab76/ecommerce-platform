import { useForm } from "react-hook-form";
import { resetPassword } from "../services/authService";
import { useState } from "react";
import { Link } from "react-router-dom";

type FormValues = {
    email: string;
};

const ForgotPassword: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>();
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        setMessage(null);
        try {
            await resetPassword(data.email);
            setMessage("Password reset email sent! Check your inbox.");
        } catch (error: any) {
            setError("email", {
                type: "manual",
                message: error.message || "Something went wrong.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-white to-gray-100 p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl space-y-6"
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">Reset Your Password</h2>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="email" className="text-sm text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", { required: "Email is required" })}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {message && <p className="text-green-600 text-sm text-center">{message}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-md shadow-md transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {loading ? "Sending..." : "Send Reset Email"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Remembered your password?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">Back to Login</Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
