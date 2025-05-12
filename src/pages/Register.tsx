import { useForm } from "react-hook-form";
import { register as registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
};

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const navigate = useNavigate();

    const onSubmit = async (data: FormData) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const user = await registerUser(data.email, data.password);

        if (user) {
            toast.success("Registration successful!");
            setTimeout(() => navigate("/dashboard"), 1500);
        } else {
            toast.error("Registration failed. Try again!");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <ToastContainer />
            <form onSubmit={handleSubmit(onSubmit)} className="w-96 p-4 shadow-md rounded-md">
                <h2 className="text-2xl mb-4">Register</h2>

                <input
                    {...register("email", { required: "Email is required" })}
                    placeholder="Email"
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                <input
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                    })}
                    type="password"
                    placeholder="Password"
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                <input
                    {...register("confirmPassword", { required: "Please confirm your password" })}
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
