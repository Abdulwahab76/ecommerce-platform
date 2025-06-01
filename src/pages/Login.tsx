import { Link, useNavigate } from "react-router-dom";
import { login, isAdmin } from "../services/authService";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

type FormValues = {
    email: string;
    password: string;
};

const quoteText = "“The best way to get started is to quit talking and begin doing.”";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        watch
    } = useForm<FormValues>();

    const [typedQuote, setTypedQuote] = useState("");
    const [loading, setLoading] = useState(false);
    // Watch values
    const email = watch("email");
    const password = watch("password");
    // Clear error while typing
    useEffect(() => {
        if (email) clearErrors("email");
        if (password) clearErrors("password");
    }, [email, password, clearErrors]);


    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            const nextChar = quoteText.charAt(i);
            if (nextChar) {
                setTypedQuote((prev) => prev + nextChar);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);

        return () => clearInterval(timer);
    }, []);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const user = await login(data.email, data.password);

            if (!user || !user.email) {
                throw new Error("Invalid user credentials");
            }

            const isAdminUser = isAdmin(user.email);
            navigate(isAdminUser ? "/admin" : "/user");

        } catch (error: any) {
            console.error("Login failed:", error.message);
            setError("password", {
                type: "manual",
                message: "Invalid email or password",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-white to-gray-100 overflow-hidden">
            {/* Quote Section */}
            <div className="md:flex hidden bg-gray-800 text-white items-center justify-center md:w-1/2 p-8">
                <p className="text-2xl md:text-3xl font-semibold max-w-md text-center animate-pulse">
                    {typedQuote}
                </p>
            </div>

            {/* Form Section */}
            <div className="flex items-center justify-center md:w-1/2 w-full p-8">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl space-y-6"
                >
                    <h2 className="text-3xl font-bold text-gray-800 text-center">Login to Your Account</h2>

                    {/* Email */}
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="email" className="text-sm text-gray-700 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="password" className="text-sm text-gray-700 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", { required: "Password is required" })}

                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex cursor-pointer justify-center items-center bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-md shadow-md transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading && (
                            <span className="loader ease-linear rounded-full border-2 border-t-2 border-white h-5 w-5 animate-spin mr-2"></span>
                        )}
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Signup Link */}
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
