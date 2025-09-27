import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

type Env = Record<string, string | undefined>;

function resolveApiTarget(env: Env) {
  const candidate = env.VITE_API_BASE_URL?.trim();
  return candidate && candidate.length > 0 ? candidate : "http://localhost:5075";
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = resolveApiTarget(env);

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
