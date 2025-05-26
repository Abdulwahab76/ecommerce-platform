// src/services/adminService.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// 🔎 Fetch Admin Profile Data
export const fetchAdminProfile = async (uid: string) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        return null;
    }
};
