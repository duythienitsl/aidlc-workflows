/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_AUTHORIZATION_URL: string;
  readonly VITE_AUTH_BASE_URL: string;
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly VITE_AUTH_COUNTRY_CODE?: string;
  readonly VITE_AUTH_TENANT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
