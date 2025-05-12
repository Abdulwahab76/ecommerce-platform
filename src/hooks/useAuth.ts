import { useAuth } from "../context/AuthContext";

export const useAuthState = () => {
    const { currentUser, loading } = useAuth();
    return { currentUser, loading };
};
