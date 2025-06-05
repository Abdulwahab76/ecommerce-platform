import { useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../../services/firebase";

const UserProfile = () => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="p-4 text-gray-500">Loading profile...</div>;
    }

    if (!user) {
        return <div className="p-4 text-red-500">User not logged in.</div>;
    }

    return (
        <div className="p-6 max-w-xl flex justify-start items-start flex-col   bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">👤 User Profile </h2>
            <div className="space-y-2 text-sm text-gray-700">

                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Email Verified:</strong> {user.emailVerified ? "✅ Yes" : "❌ No"}</p>
                <p><strong>Display Name:</strong> {user.displayName || "N/A"}</p>
                <p><strong>Phone Number:</strong> {user.phoneNumber || "N/A"}</p>
            </div>
        </div>
    );
};

export default UserProfile;
