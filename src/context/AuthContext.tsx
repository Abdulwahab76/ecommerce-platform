// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, ADMIN_UID } from "../services/firebase";

type AuthContextType = {
    currentUser: User | null;
    isAdmin: boolean;
    loading: boolean;

};

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    isAdmin: false,
    loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                setIsAdmin(user.uid === ADMIN_UID);
                setLoading(false);
            } else {
                setCurrentUser(null);
                setIsAdmin(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
