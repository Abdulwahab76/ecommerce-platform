// src/context/AuthContext.tsx
import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { isAdmin as checkAdmin } from "../services/authService";

type AuthContextType = {
    user: User | null;
    isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAdmin(checkAdmin(currentUser?.email));
        });
        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user, isAdmin }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
