import { useEffect, useState } from "react";
import { getWallet } from "./lib/api";
import type { Wallet } from "./lib/api";

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWallet()
      .then((res) => setWallet(res.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <h1 className="text-2xl font-bold mb-4">💳 Wallet</h1>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {error && <p className="text-red-600">{error}</p>}
        {!wallet ? (
          <p className="text-gray-600">Đang tải thông tin ví...</p>
        ) : (
          <>
            <p className="text-xl font-bold">
              Số dư: {wallet.balance} {wallet.currency}
            </p>
            <h2 className="mt-4 font-semibold">Lịch sử giao dịch</h2>
            <ul className="space-y-2 mt-2">
              {wallet.transactions.map((t) => (
                <li
                  key={t.id}
                  className="border rounded-lg p-3 flex justify-between"
                >
                  <span>
                    {t.type === "topup" ? "Nạp tiền" : "Thanh toán"}
                  </span>
                  <span>
                    {t.amount} {wallet.currency}
                  </span>
                  <span>{new Date(t.timestamp).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
