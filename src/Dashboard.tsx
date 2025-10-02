import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBolt, FaMapMarkerAlt } from "react-icons/fa";
import StationDetailsModal from "./StationDetailsModal";
import DriverStationMap from "./components/DriverStationMap";

interface User {
  userId: string;
  fullName: string;
  email: string;
  roles: string[];
  phoneNumber?: string;
}
type StationConnector = {
  type: string;
  power: string;
  status: "Available" | "Occupied";
};

interface DriverStation {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  availableSlots: number;
  totalSlots: number;
  distanceKm: number;
  avgPower: string;
  traffic: "Low" | "Moderate" | "High";
  waitTime: string;
  connectors: StationConnector[];
  stateOfChargePercent: number;
  activePowerKw: number;
  estimatedCostVnd: number;
}

const DRIVER_STATIONS: DriverStation[] = [
  {
    id: "vincom-dong-khoi",
    name: "Vincom Center Dong Khoi",
    address: "72 Le Thanh Ton, District 1, Ho Chi Minh City",
    coordinates: [106.704871, 10.779781],
    availableSlots: 3,
    totalSlots: 4,
    distanceKm: 2.5,
    avgPower: "45 kW",
    traffic: "Low",
    waitTime: "~5 min",
    connectors: [
      { type: "CCS", power: "50 kW", status: "Available" },
      { type: "Type 2", power: "22 kW", status: "Available" },
      { type: "CHAdeMO", power: "50 kW", status: "Occupied" },
    ],
    stateOfChargePercent: 75,
    activePowerKw: 45,
    estimatedCostVnd: 140250,
  },
  {
    id: "saigon-centre",
    name: "Saigon Centre Tower",
    address: "65 Le Loi, District 1, Ho Chi Minh City",
    coordinates: [106.70491, 10.7723],
    availableSlots: 1,
    totalSlots: 6,
    distanceKm: 1.8,
    avgPower: "60 kW",
    traffic: "Moderate",
    waitTime: "~12 min",
    connectors: [
      { type: "CCS", power: "90 kW", status: "Available" },
      { type: "Type 2", power: "22 kW", status: "Occupied" },
      { type: "GB/T", power: "60 kW", status: "Available" },
    ],
    stateOfChargePercent: 62,
    activePowerKw: 38,
    estimatedCostVnd: 98000,
  },
  {
    id: "crescent-mall",
    name: "Crescent Mall District 7",
    address: "101 Ton Dat Tien, District 7, Ho Chi Minh City",
    coordinates: [106.72103, 10.72889],
    availableSlots: 4,
    totalSlots: 8,
    distanceKm: 6.4,
    avgPower: "75 kW",
    traffic: "Low",
    waitTime: "~3 min",
    connectors: [
      { type: "CCS", power: "120 kW", status: "Available" },
      { type: "Type 2", power: "11 kW", status: "Available" },
      { type: "Type 1", power: "7 kW", status: "Available" },
    ],
    stateOfChargePercent: 88,
    activePowerKw: 52,
    estimatedCostVnd: 186400,
  },
];

const formatCurrencyVnd = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const formatAvailability = (available: number, total: number) => `${available}/${total} available`;

const formatDistanceKm = (value: number) => `${value.toFixed(1)} km`;



export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("Station Map");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    DRIVER_STATIONS[0]?.id ?? null
  );

  const stations = DRIVER_STATIONS;

  const filteredStations = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
      return stations;
    }

    return stations.filter((station) =>
      `${station.name} ${station.address}`.toLowerCase().includes(normalized)
    );
  }, [searchTerm, stations]);

  useEffect(() => {
    if (filteredStations.length === 0) {
      if (selectedStationId !== null) {
        setSelectedStationId(null);
      }
      return;
    }

    if (!selectedStationId || !filteredStations.some((station) => station.id === selectedStationId)) {
      setSelectedStationId(filteredStations[0].id);
    }
  }, [filteredStations, selectedStationId]);

  const selectedStation = useMemo(
    () => stations.find((station) => station.id === selectedStationId) ?? null,
    [stations, selectedStationId]
  );

  const mapStations = useMemo(
    () =>
      filteredStations.map((station) => ({
        id: station.id,
        name: station.name,
        address: station.address,
        coordinates: station.coordinates,
        availabilitySummary: formatAvailability(
          station.availableSlots,
          station.totalSlots
        ),
      })),
    [filteredStations]
  );

  const handleStationSelect = useCallback((stationId: string) => {
    setSelectedStationId(stationId);
  }, []);


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
          <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FaBolt /> Currently Charging
                </h2>
                <p className="mt-1 flex items-center gap-2 text-white/90">
                  <FaMapMarkerAlt className="text-white/80" />
                  {selectedStation ? selectedStation.name : "Pick a station from the map"}
                </p>
                {selectedStation && (
                  <p className="text-sm text-white/80">{selectedStation.address}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {selectedStation ? `${selectedStation.stateOfChargePercent}%` : "--"}
                </p>
                <p className="text-sm">
                  {selectedStation ? `${selectedStation.activePowerKw.toFixed(0)} kW` : "-- kW"}
                </p>
                <p className="text-sm">
                  {selectedStation ? formatCurrencyVnd(selectedStation.estimatedCostVnd) : "--"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className={`flex-1 rounded-xl py-2 font-medium transition ${
                  selectedStation
                    ? "bg-white text-blue-600 hover:bg-gray-100"
                    : "bg-white/40 text-blue-100 cursor-not-allowed"
                }`}
                disabled={!selectedStation}
              >
                Stop Charging
              </button>
              <button
                type="button"
                onClick={() => selectedStation && setIsDetailsOpen(true)}
                className={`flex-1 rounded-xl py-2 font-medium transition ${
                  selectedStation
                    ? "bg-white text-blue-600 hover:bg-gray-100"
                    : "bg-white/40 text-blue-100 cursor-not-allowed"
                }`}
                disabled={!selectedStation}
              >
                View Details
              </button>
            </div>
          </section>

          <StationDetailsModal
            isOpen={isDetailsOpen && !!selectedStation}
            onClose={() => setIsDetailsOpen(false)}
            address={selectedStation?.address ?? ""}
            avgPower={selectedStation?.avgPower ?? "--"}
            traffic={selectedStation?.traffic ?? "--"}
            waitTime={selectedStation?.waitTime ?? "--"}
            connectors={selectedStation?.connectors ?? []}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-md">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Charging Station Map</h3>
                  <p className="text-sm text-gray-500">
                    Search and compare nearby stations before reserving a spot.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by station or address..."
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  disabled={!searchTerm.trim()}
                  className={`rounded-xl px-4 py-2 font-medium transition ${
                    searchTerm.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Clear
                </button>
              </div>
              <div className="mt-4">
                <DriverStationMap
                  stations={mapStations}
                  selectedStationId={selectedStationId}
                  onStationSelect={handleStationSelect}
                  className="h-72 w-full"
                />
              </div>
            </div>

            <aside className="rounded-2xl bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold">Nearby Stations</h3>
              {filteredStations.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No station matches your search. Adjust the filters to see more options.
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredStations.map((station) => {
                    const isSelected = station.id === selectedStationId;
                    return (
                      <div
                        key={station.id}
                        className={`rounded-xl border p-4 transition ${
                          isSelected
                            ? "border-blue-500 shadow-md"
                            : "border-gray-200 shadow-sm hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-gray-900">{station.name}</p>
                            <p className="text-sm text-gray-600">{station.address}</p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              station.availableSlots > 0
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {station.availableSlots > 0 ? "Online" : "Offline"}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <p>{formatAvailability(station.availableSlots, station.totalSlots)}</p>
                          <p className="text-right font-medium text-blue-600">
                            {formatDistanceKm(station.distanceKm)}
                          </p>
                          <p>Avg power: {station.avgPower}</p>
                          <p>Traffic: {station.traffic}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {station.connectors.map((connector) => (
                            <span
                              key={`${station.id}-${connector.type}-${connector.power}`}
                              className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
                            >
                              {connector.type} - {connector.power}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleStationSelect(station.id)}
                            className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                          >
                            Reserve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleStationSelect(station.id);
                              setIsDetailsOpen(true);
                            }}
                            className="flex-1 rounded-xl bg-gray-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-black"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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













