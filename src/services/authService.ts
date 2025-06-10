import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type User,
    getIdToken,
    sendEmailVerification, sendPasswordResetEmail, getAuth
} from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
const ADMIN_EMAIL = import.meta.env.VITE_FIREBASE_ADMIN;

// 🔐 Register User and Set Profile
export const register = async (
    email: string,
    password: string,
    profileData?: { displayName?: string; phoneNumber: string }
): Promise<{ user: User | null; token: string | null }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (profileData?.displayName) {
            await updateProfile(user, {
                displayName: profileData.displayName,
            });
        }

        const token = await getIdToken(user);
        localStorage.setItem("token", token);

        // ✅ Save user details to Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: profileData?.displayName || "",
            phoneNumber: profileData?.phoneNumber || "",
            role: "user",
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            emailVerified: user.emailVerified
        });

        return { user, token };
    } catch (error) {
        console.error("Registration Error:", error);
        return { user: null, token: null };
    }
};


// 🔐 Login User
export const login = async (email: string, password: string): Promise<User | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await getIdToken(userCredential.user);
        localStorage.setItem("token", token);
        return userCredential.user;
    } catch (error) {
        console.error("Login Error:", error);
        return null;
    }
};

// 🚪 Logout User
export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
        localStorage.removeItem("token");
    } catch (error) {
        console.error("Logout Error:", error);
    }
};

// 🛡️ Admin Role Checker
export const isAdmin = (email: string | null | undefined): boolean => {
    return email === ADMIN_EMAIL;
};
export const sendVerificationEmail = async (user: User) => {
    return sendEmailVerification(user);
};


export const resetPassword = async (email: string): Promise<void> => {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
};