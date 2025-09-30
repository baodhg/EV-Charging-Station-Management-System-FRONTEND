import { useEffect, useState } from "react";
import { getHistory } from "./lib/api";
import type { ChargingHistory } from "./lib/api";

export default function History() {
  const [history, setHistory] = useState<ChargingHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <h1 className="text-2xl font-bold mb-4">📜 History</h1>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {error && <p className="text-red-600">{error}</p>}
        {history.length === 0 ? (
          <p className="text-gray-600">Chưa có lịch sử giao dịch.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((h) => (
              <li key={h.sessionId} className="border rounded-lg p-4">
                <p className="font-bold">{h.stationName}</p>
                <p>
                  {new Date(h.startTime).toLocaleString()} →{" "}
                  {new Date(h.endTime).toLocaleString()}
                </p>
                <p>
                  ⚡ {h.energyConsumedKWh} kWh — ₫
                  {h.cost.toLocaleString("vi-VN")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
