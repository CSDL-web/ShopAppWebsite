import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tsconfigPaths(), svgr()],
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_ENV),
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
        scss: {
          // additionalData:,
        },
      },
    },
    server: {
      port: 5173,
      open: true,
      proxy: {
        // Gửi request /api -> Flask backend (port 5000)
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
