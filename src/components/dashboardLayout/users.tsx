// src/pages/admin/Users.tsx
import React, { useState } from "react";
import { useUsers, type User } from "../../hooks/useUsers";

const Users: React.FC = () => {
    const { users, loading, error, deleteUser, updateUserRole } = useUsers();

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editRole, setEditRole] = useState("");

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditRole(user.role);
    };

    const saveEdit = async () => {
        if (!editingUser) return;
        await updateUserRole(editingUser.uid, editRole);
        setEditingUser(null);
    };

    return (
        <div className="p-4 bg-white rounded shadow-md overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>

            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <div className="w-full overflow-auto">
                    <table className="min-w-[600px] w-full text-sm border border-collapse">
                        <thead className="text-left">
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
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center text-gray-500 py-4">
                                        No users found.
                                    </td>
                                </tr>
                            )}
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
                                            onClick={() => deleteUser(user.uid)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
