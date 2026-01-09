import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

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
      port: 3000, // Để port 3000 cho khớp với lệnh mày chạy
      host: true,  // Cho phép truy cập từ IP ngoài
      allowedHosts: [
        'tonypham.duckdns.org' // <--- MỞ KHÓA CHO DOMAIN CỦA MÀY
      ],
      proxy: {
        // Nếu mày dùng proxy trong code thì nó sẽ đẩy về backend
        "/api": {
          target: "http://localhost:5000", // Sửa thành 5000 cho đúng port backend mày đang chạy
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
