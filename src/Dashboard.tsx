import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBolt, FaMapMarkerAlt } from "react-icons/fa";
import StationDetailsModal from "./StationDetailsModal";

interface User {
  userId: string;
  fullName: string;
  email: string;
  email2: string;
  roles: string[];
  phoneNumber?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("Station Map");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-100">
        <p className="text-blue-700">Loading dashboard...</p>
      </div>
    );
  }

  const tabs = ["Station Map", "Reservations", "History", "Profile", "Wallet"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 text-gray-900 px-6 py-8">
      {/* ================= Header ================= */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
          <FaBolt className="text-blue-600" />
          EV Charging Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">{user.fullName}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ================= Tab Bar ================= */}
      <div className="flex bg-blue-100 rounded-full p-1 mb-8 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow"
                : "text-blue-700 hover:bg-blue-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= Station Map ================= */}
      {activeTab === "Station Map" && (
        <>
          {/* Card */}
          <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FaBolt /> Currently Charging
                </h2>
                <p className="mt-1 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-white/80" />
                  Vincom Center Đồng Khởi
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">75%</p>
                <p className="text-sm">45 kW</p>
                <p className="text-sm">₫ 140.250</p>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="flex-1 bg-white text-blue-600 rounded-xl py-2 font-medium hover:bg-gray-100 transition">
                Stop Charging
              </button>
              <button
                onClick={() => setIsDetailsOpen(true)}
                className="flex-1 bg-white text-blue-600 rounded-xl py-2 font-medium hover:bg-gray-100 transition"
              >
                View Details
              </button>
            </div>
          </section>

          {/* Modal */}
          <StationDetailsModal
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            address="72 Lê Thánh Tôn, District 1, Ho Chi Minh City"
            avgPower="45 kW"
            traffic="Low"
            waitTime="~5 min"
            connectors={[
              { type: "CCS", power: "50 kW", status: "Available" },
              { type: "Type 2", power: "22 kW", status: "Available" },
              { type: "CHAdeMO", power: "50 kW", status: "Occupied" },
            ]}
          />

          {/* Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Charging Station Map</h3>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search for location..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
                />
                <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
                  Search
                </button>
              </div>
              <div className="h-64 rounded-xl bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-gray-600">
                [Map Placeholder]
              </div>
            </div>

            {/* Nearby stations */}
            <aside className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Nearby Stations</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">Vincom Center Đồng Khởi</p>
                    <span className="text-sm px-2 py-1 bg-green-100 text-green-600 rounded-full">
                      Online
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">72 Lê Thánh Tôn, Quận 1</p>
                  <p className="text-sm text-gray-600">2/4 available</p>
                  <p className="text-sm font-medium text-blue-600">2.5 km</p>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
                      Reserve
                    </button>
                    <button
                      onClick={() => setIsDetailsOpen(true)}
                      className="flex-1 px-3 py-2 rounded-xl bg-gray-800 text-white text-sm hover:bg-black transition"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}

      {/* ================= Reservations ================= */}
      {activeTab === "Reservations" && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-6">My Reservations</h3>
          <div className="p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">Vincom Center Đồng Khởi</p>
              <span className="text-sm px-3 py-1 bg-green-100 text-green-600 rounded-full">
                Active
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <p>⏱ Start: 9/30/2025, 4:09:10 AM</p>
              <p>⏱ End: 9/30/2025, 6:09:10 AM</p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition">
                Cancel Reservation
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= History ================= */}
      {activeTab === "History" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">This Month&apos;s Stats</h3>
            <ul className="space-y-3 text-gray-700">
              <li>Charging sessions: <span className="font-semibold">12 times</span></li>
              <li>Total energy: <span className="font-semibold">245.8 kWh</span></li>
              <li>Total cost: <span className="font-semibold">1.350.000 đ</span></li>
              <li>Favorite station: <span className="font-semibold">Vincom Đồng Khởi</span></li>
            </ul>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Charging History</h3>
            <div className="p-5 rounded-2xl border border-gray-200 shadow-sm mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Vincom Center Đồng Khởi</p>
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                  Charging
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <p>⚡ 25.5 kWh</p>
                <p>📅 9/30/2025</p>
                <p>₫ 140.250</p>
              </div>
              <p className="text-sm text-gray-500 mb-3">Payment: e-wallet</p>
              <button className="px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-black transition">
                View Invoice
              </button>
            </div>
            <div className="p-5 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Vincom Center Đồng Khởi</p>
                <span className="text-sm px-3 py-1 bg-green-100 text-green-600 rounded-full">
                  Completed
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <p>⚡ 42.8 kWh</p>
                <p>📅 9/29/2025</p>
                <p>₫ 235.400</p>
              </div>
              <p className="text-sm text-gray-500 mb-3">Payment: subscription</p>
              <button className="px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-black transition">
                View Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Profile ================= */}
      {activeTab === "Profile" && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-6">User Profile</h3>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-lg font-semibold">{user.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p>{user.phoneNumber || "0901234567"}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/profile/edit")}
              className="w-full px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Update Information
            </button>
            <button
              onClick={() => navigate("/profile/change-password")}
              className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white font-medium hover:bg-black transition"
            >
              Change Password
            </button>
          </div>
        </div>
      )}

      {/* ================= Wallet ================= */}
      {activeTab === "Wallet" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              💳 Digital Wallet
            </h3>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-center mb-6 text-white">
              <p className="text-sm mb-2">Current Balance</p>
              <p className="text-3xl font-bold">500.000 đ</p>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 px-4 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition">
                Add Funds
              </button>
              <button className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-white font-medium hover:bg-black transition">
                Transaction History
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
            <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4 mb-3">
              <div>
                <p className="font-medium">•••• •••• 1234</p>
                <p className="text-sm text-gray-500">Visa - Primary</p>
              </div>
              <button className="px-3 py-1 rounded-lg bg-gray-800 text-white text-sm hover:bg-black">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4 mb-3">
              <div>
                <p className="font-medium">MoMo Wallet</p>
                <p className="text-sm text-gray-500">Mobile Payment</p>
              </div>
              <button className="px-3 py-1 rounded-lg bg-gray-800 text-white text-sm hover:bg-black">
                Edit
              </button>
            </div>
            <button className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-black transition">
              Add New Payment Method
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
