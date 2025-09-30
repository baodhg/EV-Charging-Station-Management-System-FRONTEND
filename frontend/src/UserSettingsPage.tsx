import { useState } from "react";

interface User {
  userId: string;
  fullName: string;
  email: string;
  roles: string[];
  phoneNumber?: string;
}

interface Props {
  user: User;
}

export default function UserSettingsPage({ user }: Props) {
  const [tab, setTab] = useState<"info" | "password">("info");
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveInfo = () => {
    console.log("Update Info:", { fullName, email, phoneNumber });
    // TODO: gọi API update profile
    alert("User info updated successfully!");
  };

  const handleChangePassword = () => {
    console.log("Change Password:", { oldPassword, newPassword });
    // TODO: gọi API change password
    alert("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6">User Settings</h2>

      {/* Tab Selector */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab("info")}
          className={`flex-1 py-2 font-semibold ${
            tab === "info"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Update Info
        </button>
        <button
          onClick={() => setTab("password")}
          className={`flex-1 py-2 font-semibold ${
            tab === "password"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Update Info */}
      {tab === "info" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={handleSaveInfo}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Change Password */}
      {tab === "password" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </div>
      )}
    </div>
  );
}
