import { useEffect, useState } from "react";
import { getCurrentUser, updateProfile } from "./lib/api";
import type { UserProfile } from "./lib/api";

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    getCurrentUser().then((res) => {
      setUser(res.data);
      setFullName(res.data.fullName);
      setPhone(res.data.phoneNumber ?? "");
    });
  }, []);

  const handleSave = () => {
    updateProfile({ fullName, phoneNumber: phone }).then((res) =>
      setUser(res.data)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg">
        {user ? (
          <>
            <label className="block mb-2">
              <span className="text-gray-600">Họ tên</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-600">Email</span>
              <input
                value={user.email}
                disabled
                className="border rounded-lg p-2 w-full bg-gray-100"
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-600">SĐT</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
            </label>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-3"
            >
              Lưu thay đổi
            </button>
          </>
        ) : (
          <p>Đang tải thông tin người dùng...</p>
        )}
      </div>
    </div>
  );
}
