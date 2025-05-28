import React from "react";

type AdminProfileCardProps = {
    profile: {
        displayName?: string;
        email?: string;
        emailVerified: any
    } | null;
};

const AdminProfileCard: React.FC<AdminProfileCardProps> = ({ profile }) => {

    return (
        <div className="bg-white shadow-lg p-5 rounded-lg max-w-lg">
            <h2 className="text-xl font-bold mb-2">Admin Profile</h2>
            {profile ? (
                <>
                    <p><strong>Name:</strong> {profile.displayName || 'Unknown'}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Verified:</strong> {profile.emailVerified == false ? 'false' : 'true'}</p>
                </>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default AdminProfileCard;
