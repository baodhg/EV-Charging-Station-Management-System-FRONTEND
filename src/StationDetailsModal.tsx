interface Connector {
  type: string;
  power: string;
  status: "Available" | "Occupied";
}

interface StationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  avgPower: string;
  traffic: string;
  waitTime: string;
  connectors: Connector[];
}

export default function StationDetailsModal({
  isOpen,
  onClose,
  address,
  avgPower,
  traffic,
  waitTime,
  connectors,
}: StationDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 rounded-2xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Station Details</h2>

        {/* Address */}
        <div className="mb-4">
          <h3 className="font-semibold">Address</h3>
          <p className="text-gray-700">{address}</p>
        </div>

        {/* Current Activity */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Current Activity</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-100 rounded-xl p-3 text-center">
              <p className="text-yellow-500">⚡</p>
              <p className="font-bold">{avgPower}</p>
              <p className="text-xs text-gray-500">Avg Power</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-3 text-center">
              <p className="text-blue-500">🚗</p>
              <p className="font-bold">{traffic}</p>
              <p className="text-xs text-gray-500">Traffic</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-3 text-center">
              <p className="text-purple-500">⏱️</p>
              <p className="font-bold">{waitTime}</p>
              <p className="text-xs text-gray-500">Wait Time</p>
            </div>
          </div>
        </div>

        {/* Available Connectors */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Available Connectors</h3>
          <div className="grid grid-cols-2 gap-3">
            {connectors.map((c, i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-3">
                <p className="font-bold">{c.type}</p>
                <p className="text-sm text-gray-600">{c.power}</p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    c.status === "Available"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="mb-4">
          <h3 className="font-semibold">Operating Hours</h3>
          <p className="text-gray-700">24/7</p>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h3 className="font-semibold">Amenities</h3>
          <p className="text-gray-700">WiFi, Restroom, Cafe</p>
        </div>

        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
