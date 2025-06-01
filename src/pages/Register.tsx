import { useForm } from "react-hook-form";
import { register as registerUser, sendVerificationEmail } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";

type FormData = {
    fullName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const quoteText = "“Your journey to success begins with a single step. Register now!”";

const Register: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
        clearErrors,
        watch
    } = useForm<FormData>({ mode: "onChange" });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [typedQuote, setTypedQuote] = useState("");

    // Typing animation
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

    // Watch fields and clear errors when typing
    const watchedFields = watch(["fullName", "phone", "email", "password", "confirmPassword"]);

    useEffect(() => {
        if (watchedFields[0]) clearErrors("fullName");
        if (watchedFields[1]) clearErrors("phone");
        if (watchedFields[2]) clearErrors("email");
        if (watchedFields[3]) clearErrors("password");
        if (watchedFields[4]) clearErrors("confirmPassword");
    }, [watchedFields, clearErrors]);

    const onSubmit = async (data: FormData) => {
        if (data.password !== data.confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
            });
            return;
        }

        setLoading(true);
        try {
            const { user } = await registerUser(data.email, data.password, {
                displayName: data.fullName,
                phoneNumber: data.phone,
            });

            if (user) {
                await sendVerificationEmail(user);
                toast.success("Registration successful! Check your email to verify.");
                navigate("/verify-email");
            } else {
                toast.error("Email already in use. Please try again.");
                reset();
            }
        } catch (error) {
            if (error instanceof FirebaseError && error.code === "auth/email-already-in-use") {
                setError("email", { type: "manual", message: "This email is already in use" });
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-white to-gray-100">
            <ToastContainer />

            {/* Quote Side */}
            <div className="md:flex hidden bg-gray-800 text-white items-center justify-center md:w-1/2 p-8">
                <p className="text-2xl md:text-3xl font-semibold max-w-md text-center animate-pulse">
                    {typedQuote}
                </p>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center md:w-1/2 w-full p-8">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl space-y-5"
                >
                    <h2 className="text-3xl font-bold text-gray-800 text-center">Create Account</h2>

                    {/* Full Name */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 font-medium">Full Name</label>
                        <input
                            {...register("fullName", { required: "Full name is required" })}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 font-medium">Phone</label>
                        <input
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^\+?[1-9][0-9]{9,14}$/,
                                    message: "Enter a valid phone number (10–15 digits)",
                                },
                            })}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your phone number"
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 font-medium">Email</label>
                        <input
                            {...register("email", { required: "Email is required" })}
                            type="email"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 font-medium">Password</label>
                        <input
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Minimum 6 characters" },
                            })}
                            type="password"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 font-medium">Confirm Password</label>
                        <input
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                            })}
                            type="password"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Re-enter your password"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-white p-3 rounded transition-opacity duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
