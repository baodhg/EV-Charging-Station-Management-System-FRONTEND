/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly DEV: boolean;
  // thêm biến khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
