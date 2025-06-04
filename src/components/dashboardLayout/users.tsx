// src/pages/admin/Users.tsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

interface User {
    uid: string;
    email: string;
    displayName: string;
    phoneNumber: string;
    role: string;
    emailVerified: boolean;
    createdAt?: any;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editRole, setEditRole] = useState("");

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
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (uid: string) => {
        try {
            await deleteDoc(doc(db, "users", uid));
            setUsers(prev => prev.filter(user => user.uid !== uid));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditRole(user.role);
    };

    const saveEdit = async () => {
        if (!editingUser) return;

        try {
            await updateDoc(doc(db, "users", editingUser.uid), {
                role: editRole,
            });
            setUsers(prev =>
                prev.map(user =>
                    user.uid === editingUser.uid ? { ...user, role: editRole } : user
                )
            );
            setEditingUser(null);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow-md overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="w-full overflow-auto">
                    <table className="min-w-[600px] w-full text-sm border border-collapse   ">
                        <thead className="  text-left">
                            <tr>
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">Phone</th>
                                <th className="p-2 border">Role</th>
                                <th className="p-2 border">Verified</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.uid} className="border-t hover:bg-gray-50">
                                    <td className="p-2 border">{user.displayName || "N/A"}</td>
                                    <td className="p-2 border">{user.email}</td>
                                    <td className="p-2 border">{user.phoneNumber || "N/A"}</td>
                                    <td className="p-2 border capitalize">{user.role}</td>
                                    <td className="p-2 border">{user.emailVerified ? "Yes" : "No"}</td>
                                    <td className="p-2 border space-x-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.uid)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <p className="text-gray-500 text-center mt-4">No users found.</p>)}
                </div>
            )}

            {/* Edit Role Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
                        <h3 className="text-lg font-bold mb-4">Edit User Role</h3>
                        <p className="mb-2 text-sm text-gray-700">User: {editingUser.email}</p>
                        <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 mb-4"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
