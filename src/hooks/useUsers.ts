// src/hooks/useUsers.ts
import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export interface User {
    uid: string;
    email: string;
    displayName: string;
    phoneNumber: string;
    role: string;
    emailVerified: boolean;
    createdAt?: any;
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const snapshot = await getDocs(collection(db, "users"));
            const usersList = snapshot.docs.map(doc => {
                const data = doc.data() as User;
                return {
                    ...data,
                    uid: doc.id,
                };
            });
            setUsers(usersList);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (uid: string) => {
        try {
            await deleteDoc(doc(db, "users", uid));
            setUsers(prev => prev.filter(user => user.uid !== uid));
        } catch (err) {
            console.error("Error deleting user:", err);
            setError("Failed to delete user.");
        }
    };

    const updateUserRole = async (uid: string, role: string) => {
        try {
            await updateDoc(doc(db, "users", uid), { role });
            setUsers(prev =>
                prev.map(user => (user.uid === uid ? { ...user, role } : user))
            );
        } catch (err) {
            console.error("Error updating user role:", err);
            setError("Failed to update user role.");
        }
    };

    return { users, loading, error, deleteUser, updateUserRole };
};
