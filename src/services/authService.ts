import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, type User, getIdToken
} from "firebase/auth";
import { auth } from "./firebase";

// 🔐 Register User and Get Token
export const register = async (email: string, password: string): Promise<{ user: User | null, token: string | null }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // 🗝️ Get the ID Token from Firebase
        const token = await getIdToken(userCredential.user);

        localStorage.setItem("token", token);

        return { user: userCredential.user, token };
    } catch (error) {
        console.error("Registration Error:", error);
        return { user: null, token: null };
    }
};

export const login = async (email: string, password: string): Promise<User | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Login Error:", error);
        return null;
    }
};

export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
    }
};
