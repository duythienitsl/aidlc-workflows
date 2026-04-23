import path from "path";

import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const mfeName = env.VITE_MFE_NAME || "my_app";
  const authorizationUiUrl =
    env.VITE_AUTHORIZATION_UI_URL ||
    env.VITE_AUTH_UI_REMOTE_URL ||
    "http://localhost:5182";

  return {
    base: "/",
    plugins: [
      react(),
      federation({
        name: mfeName,
        // Disable automatic DTS download — types are declared manually
        dts: false,
        remotes: {
          remote_app: {
            type: "module",
            name: "remote_app",
            // Works for both vite dev (no build) and vite preview (built)
            entry: `${authorizationUiUrl}/remoteEntry.js`,
          },
        },
        shared: {
          react: { singleton: true, requiredVersion: "^18.0.0" },
          "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
          "react-router-dom": { singleton: true, requiredVersion: "^7.0.0" },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      postcss: "./postcss.config.js",
    },
    build: {
      sourcemap: true,
      modulePreload: false,
      // chrome89 required for top-level await in module federation runtime
      target: "chrome89",
      minify: false,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          format: "es",
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
        },
      },
    },
    server: {
      port: 5175,
      strictPort: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    preview: {
      port: 5175,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  };
});
