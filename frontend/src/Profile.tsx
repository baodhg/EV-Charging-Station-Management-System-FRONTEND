import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-6 py-8">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        <div className="space-y-3">
          <p><span className="font-semibold">Full Name:</span> {user.fullName}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Phone:</span> {user.phoneNumber || "N/A"}</p>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/profile/edit")}
            className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/profile/change-password")}
            className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-black transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
