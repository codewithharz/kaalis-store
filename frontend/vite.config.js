import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import { qrcode } from "vite-plugin-qrcode";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      "process.env": {},
      // Expose Paystack key to the app
      "import.meta.env.VITE_PAYSTACK_PUBLIC_KEY": JSON.stringify(
        env.VITE_PAYSTACK_PUBLIC_KEY
      ),
    },
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    plugins: [vue(), qrcode()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Add env configuration
    envPrefix: "VITE_",
    // Optional: Add env directory configuration
    envDir: path.resolve(__dirname),
    // Add server configuration for development
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:7787",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure: (proxy, options) => {
            proxy.on("error", (err, req, res) => {
              console.error("Proxy Error:", err);
            });
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Sending Request:", req.method, req.url);
            });
          },
        },
      },
    },
    optimizeDeps: {
      include: ["vue3-apexcharts", "apexcharts"],
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: command === "serve",
      chunkSizeWarningLimit: 2000,
      // Optimize chunks
      rollupOptions: {
        output: {
          manualChunks: {
            "vue-vendor": ["vue", "vue-router", "pinia"],
            "chart-vendor": ["chart.js", "apexcharts", "vue3-apexcharts"],
            "core-vendor": ["@vueuse/core", "axios"],
            "ui-vendor": [
              "@headlessui/vue",
              "@heroicons/vue",
              "lucide-vue-next",
            ],
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith(".css")) {
              return "assets/css/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
        },
        external: ["jsbarcode/bin/JsBarcode.all.min.js"],
      },
    },
    // Optional: Add preview configuration
    preview: {
      port: 4173,
      host: true,
    },
  };
});
