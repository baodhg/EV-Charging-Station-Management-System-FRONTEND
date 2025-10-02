import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVehicleModels, createDriverVehicle, type VehicleModel, type CreateDriverVehiclePayload } from "./lib/api";

export default function VehicleRegistrationForm() {
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<number>(0);
  const [licensePlate, setLicensePlate] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const navigate = useNavigate();

  // Load vehicle models on component mount
  useEffect(() => {
    const loadVehicleModels = async () => {
      try {
        setIsLoadingModels(true);
        const response = await getVehicleModels();
        if (response.success) {
          setVehicleModels(response.data);
          if (response.data.length > 0) {
            setSelectedModelId(response.data[0].modelId);
          }
        } else {
          setError("Không thể tải danh sách mẫu xe. Vui lòng thử lại.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải danh sách mẫu xe.");
      } finally {
        setIsLoadingModels(false);
      }
    };

    loadVehicleModels();
  }, []);

  // Validate license plate format (Vietnamese format)
  const validateLicensePlate = (plate: string): boolean => {
    const pattern = /^\d{2}[A-Za-z]\d{5}$/;
    return pattern.test(plate.replace(/[- ]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedModelId) {
      setError("Vui lòng chọn mẫu xe.");
      return;
    }

    if (!licensePlate.trim()) {
      setError("Vui lòng nhập biển số xe.");
      return;
    }

    if (!validateLicensePlate(licensePlate)) {
      setError("Biển số xe không đúng định dạng (VD: 30A12345).");
      return;
    }

    setIsLoading(true);
    try {
      const payload: CreateDriverVehiclePayload = {
        modelId: selectedModelId,
        licensePlate: licensePlate.trim().toUpperCase().replace(/[- ]/g, ""),
        setAsDefault,
      };

      const response = await createDriverVehicle(payload);

      if (!response.success) {
        throw new Error(response.message || "Tạo xe thất bại");
      }

      // Success - mark onboarding as done for this user and redirect
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored) as { userId?: string };
          if (parsed?.userId) {
            localStorage.setItem(`onboarding_vehicle_skipped_${parsed.userId}`, "true");
          }
        }
      } catch {}
      navigate("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Tạo xe thất bại";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedModel = vehicleModels.find(model => model.modelId === selectedModelId);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-blue-500 text-white text-3xl font-bold">
            🚗
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Đăng ký xe
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Thêm xe của bạn vào hệ thống
        </p>

        {/* Form */}
        <form id="vehicle-registration-form" className="space-y-5" onSubmit={handleSubmit}>
          {/* Vehicle Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mẫu xe <span className="text-red-500">*</span>
            </label>
            {isLoadingModels ? (
              <div className="w-full rounded-2xl border border-gray-300 px-4 py-3 bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Đang tải...</span>
              </div>
            ) : (
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(Number(e.target.value))}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={0}>Chọn mẫu xe</option>
                {vehicleModels.map((model) => (
                  <option key={model.modelId} value={model.modelId}>
                    {model.brandName} {model.modelName} {model.releaseYear && `(${model.releaseYear})`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* License Plate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biển số xe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="30A12345"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Định dạng: 30A12345 (2 số + 1 chữ + 5 số)
            </p>
          </div>

          {/* Set as Default */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="setAsDefault"
              checked={setAsDefault}
              onChange={(e) => setSetAsDefault(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="setAsDefault" className="ml-2 block text-sm text-gray-700">
              Đặt làm xe mặc định
            </label>
          </div>

          {/* Selected Model Info */}
          {selectedModel && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Thông tin xe đã chọn:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Hãng:</strong> {selectedModel.brandName}</p>
                <p><strong>Model:</strong> {selectedModel.modelName}</p>
                {selectedModel.releaseYear && (
                  <p><strong>Năm:</strong> {selectedModel.releaseYear}</p>
                )}
                <p><strong>Dung lượng pin:</strong> {selectedModel.batteryCapacityKwh} kWh</p>
                {selectedModel.maxChargingPowerKwAc && (
                  <p><strong>Công suất sạc AC:</strong> {selectedModel.maxChargingPowerKwAc} kW</p>
                )}
                {selectedModel.maxChargingPowerKwDc && (
                  <p><strong>Công suất sạc DC:</strong> {selectedModel.maxChargingPowerKwDc} kW</p>
                )}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </form>

        {/* Skip / Back */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => {
              try {
                const stored = localStorage.getItem("user");
                if (stored) {
                  const parsed = JSON.parse(stored) as { userId?: string };
                  if (parsed?.userId) {
                    localStorage.setItem(`onboarding_vehicle_skipped_${parsed.userId}`, "true");
                  }
                }
              } catch {}
              navigate("/dashboard");
            }}
            className="text-gray-600 hover:text-blue-600"
          >
            Bỏ qua và làm sau
          </button>
          <button
            type="submit"
            form="vehicle-registration-form"
            disabled={isLoading || isLoadingModels || !selectedModelId}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl px-6 py-3 shadow-md hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang tạo xe..." : "Đăng ký xe"}
          </button>
        </div>
      </div>
    </div>
  );
}