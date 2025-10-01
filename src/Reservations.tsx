import { useEffect, useState } from "react";
import { getReservations } from "./lib/api";
import type { Reservation } from "./lib/api";

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getReservations()
      .then((res) => setReservations(res.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <h1 className="text-2xl font-bold mb-4">📅 Reservations</h1>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {error && <p className="text-red-600">{error}</p>}
        {reservations.length === 0 ? (
          <p className="text-gray-600">Chưa có đặt chỗ nào.</p>
        ) : (
          <ul className="space-y-3">
            {reservations.map((r) => (
              <li
                key={r.reservationId}
                className="border rounded-lg p-4 flex justify-between"
              >
                <div>
                  <p className="font-bold">{r.stationName}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(r.startTime).toLocaleString()} →{" "}
                    {r.endTime ? new Date(r.endTime).toLocaleString() : "—"}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-white bg-blue-500">
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
