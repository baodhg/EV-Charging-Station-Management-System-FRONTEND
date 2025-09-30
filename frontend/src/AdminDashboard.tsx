import { useState } from "react";
import {
  FaBolt,
  FaChartLine,
  FaChargingStation,
  FaUsers,
  FaDollarSign,
  FaCog,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    { name: "Overview", icon: <FaChartLine /> },
    { name: "Stations", icon: <FaChargingStation /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Pricing", icon: <FaDollarSign /> },
    { name: "Analytics", icon: <FaChartLine /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaBolt className="text-yellow-400" />
          EV Charging Management
        </h1>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-semibold">John Doe</p>
            <p className="text-sm text-gray-400">Admin</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-red-500 transition">
            Sign Out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-gray-800 rounded-full p-1 mb-8 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-semibold transition ${
              activeTab === tab.name
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow"
                : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2">Total Stations</h3>
            <p className="text-3xl font-bold">4</p>
            <p className="text-green-400 text-sm">+2 this week</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-3xl font-bold">1</p>
            <p className="text-green-400 text-sm">+18 this week</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
            <p className="text-3xl font-bold">$15,750,000</p>
            <p className="text-green-400 text-sm">+12.5%</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2">Utilization Rate</h3>
            <p className="text-3xl font-bold">68%</p>
            <p className="text-green-400 text-sm">+5.2%</p>
          </div>

          {/* Chart Placeholder */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Monthly Revenue Chart</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              Revenue Chart (Recharts integration here)
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                Active Stations:{" "}
                <span className="text-green-400 font-semibold">3/4</span>
              </li>
              <li>
                Under Maintenance:{" "}
                <span className="text-yellow-400 font-semibold">1</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Average Utilization</span>
                <span className="font-semibold text-white">68%</span>
              </li>
            </ul>
            <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
              <div className="bg-yellow-400 h-2 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "Overview" && (
        <div className="bg-gray-800 rounded-2xl p-6 shadow-md text-gray-400">
          <h3 className="text-lg font-semibold mb-2">{activeTab}</h3>
          <p>Content for {activeTab} will be added soon...</p>
        </div>
      )}
    </div>
  );
}
