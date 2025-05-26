import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

type FormValues = {
    email: string;
    password: string;
};

const quoteText = "“The best way to get started is to quit talking and begin doing.”";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

    const [typedQuote, setTypedQuote] = useState("");
    const [inputStates, setInputStates] = useState({ email: "", password: "" });

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < quoteText.length) {
                setTypedQuote(prev => prev + (quoteText[i] || ""));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputStates(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (data: FormValues) => {
        const user = await login(data.email, data.password);
        console.log(user, 'user==');

        if (user && user.email !== 'abdulpk12@gmail.com') {
            navigate("/user");
        } else {
            navigate("/admin");
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen md:justify-around justify-center md:min-h-screen bg-gradient-to-r from-white to-gray-100">
            {/* Quote side */}
            <div className="md:flex hidden bg-gray-800 text-white   items-center justify-center md:w-1/2 w-full p-8">
                <p className="text-2xl md:text-3xl font-semibold max-w-md text-center animate-pulse">
                    {typedQuote}
                </p>
            </div>

            {/* Form side */}
            <div className="flex items-center justify-center md:w-1/2 w-full p-8">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-transparent md:bg-white p-8 rounded-lg shadow-none md:shadow-xl space-y-6"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login to Your Account</h2>

                    {/* Email Field */}
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            {...register("email", { required: "Email is required" })}
                            name="email"
                            onInput={handleInputChange}
                            className={`w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 p-2 bg-transparent`}
                        />
                        <label
                            htmlFor="email"
                            className={`absolute left-2 top-2 text-gray-500 text-sm transition-opacity duration-300 ${inputStates.email ? "opacity-0" : "opacity-100"
                                }`}
                        >
                            Email
                        </label>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            {...register("password", { required: "Password is required" })}
                            name="password"
                            onInput={handleInputChange}
                            className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 p-2 bg-transparent"
                        />
                        <label
                            htmlFor="password"
                            className={`absolute left-2 top-2 text-gray-500 text-sm transition-opacity duration-300 ${inputStates.password ? "opacity-0" : "opacity-100"
                                }`}
                        >
                            Password
                        </label>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-md shadow-md cursor-pointer "
                    >
                        Login
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Don't have an account?
                        <Link to='/register'><span className="text-blue-500 cursor-pointer hover:underline">Sign up</span></Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
