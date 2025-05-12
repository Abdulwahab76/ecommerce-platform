import { login } from "../services/authService";

const Login: React.FC = () => {
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;

        const user = await login(email, password);
        if (user) {
            console.log("Login successful:", user.email);
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-4">
            <input type="email" name="email" placeholder="Email" required className="block mb-2" />
            <input type="password" name="password" placeholder="Password" required className="block mb-2" />
            <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
        </form>
    );
};

export default Login;
