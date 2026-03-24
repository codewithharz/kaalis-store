// vite.config.js
import path from "path";
import { defineConfig, loadEnv } from "file:///Users/harz/Downloads/Bruthol/kaalis-store/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/harz/Downloads/Bruthol/kaalis-store/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import tailwind from "file:///Users/harz/Downloads/Bruthol/kaalis-store/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///Users/harz/Downloads/Bruthol/kaalis-store/node_modules/autoprefixer/lib/autoprefixer.js";
import { qrcode } from "file:///Users/harz/Downloads/Bruthol/kaalis-store/node_modules/vite-plugin-qrcode/dist/index.js";
var __vite_injected_original_dirname = "/Users/harz/Downloads/Bruthol/kaalis-store/frontend";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      "process.env": {},
      // Expose Paystack key to the app
      "import.meta.env.VITE_PAYSTACK_PUBLIC_KEY": JSON.stringify(
        env.VITE_PAYSTACK_PUBLIC_KEY
      )
    },
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()]
      }
    },
    plugins: [vue(), qrcode()],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    // Add env configuration
    envPrefix: "VITE_",
    // Optional: Add env directory configuration
    envDir: path.resolve(__vite_injected_original_dirname),
    // Add server configuration for development
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:7787",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api/, ""),
          configure: (proxy, options) => {
            proxy.on("error", (err, req, res) => {
              console.error("Proxy Error:", err);
            });
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Sending Request:", req.method, req.url);
            });
          }
        }
      }
    },
    optimizeDeps: {
      include: ["vue3-apexcharts", "apexcharts"]
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: command === "serve",
      chunkSizeWarningLimit: 2e3,
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
              "lucide-vue-next"
            ]
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith(".css")) {
              return "assets/css/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          }
        },
        external: ["jsbarcode/bin/JsBarcode.all.min.js"]
      }
    },
    // Optional: Add preview configuration
    preview: {
      port: 4173,
      host: true
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaGFyei9Eb3dubG9hZHMvQnJ1dGhvbC9rYWFsaXMtc3RvcmUvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9oYXJ6L0Rvd25sb2Fkcy9CcnV0aG9sL2thYWxpcy1zdG9yZS9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvaGFyei9Eb3dubG9hZHMvQnJ1dGhvbC9rYWFsaXMtc3RvcmUvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHRhaWx3aW5kIGZyb20gXCJ0YWlsd2luZGNzc1wiO1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tIFwiYXV0b3ByZWZpeGVyXCI7XG5pbXBvcnQgeyBxcmNvZGUgfSBmcm9tIFwidml0ZS1wbHVnaW4tcXJjb2RlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgLy8gTG9hZCBlbnYgZmlsZSBiYXNlZCBvbiBgbW9kZWAgaW4gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnlcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKTtcblxuICByZXR1cm4ge1xuICAgIGRlZmluZToge1xuICAgICAgX19WVUVfT1BUSU9OU19BUElfXzogdHJ1ZSxcbiAgICAgIF9fVlVFX1BST0RfREVWVE9PTFNfXzogZmFsc2UsXG4gICAgICBcInByb2Nlc3MuZW52XCI6IHt9LFxuICAgICAgLy8gRXhwb3NlIFBheXN0YWNrIGtleSB0byB0aGUgYXBwXG4gICAgICBcImltcG9ydC5tZXRhLmVudi5WSVRFX1BBWVNUQUNLX1BVQkxJQ19LRVlcIjogSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIGVudi5WSVRFX1BBWVNUQUNLX1BVQkxJQ19LRVlcbiAgICAgICksXG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW3RhaWx3aW5kKCksIGF1dG9wcmVmaXhlcigpXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbdnVlKCksIHFyY29kZSgpXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBBZGQgZW52IGNvbmZpZ3VyYXRpb25cbiAgICBlbnZQcmVmaXg6IFwiVklURV9cIixcbiAgICAvLyBPcHRpb25hbDogQWRkIGVudiBkaXJlY3RvcnkgY29uZmlndXJhdGlvblxuICAgIGVudkRpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSksXG4gICAgLy8gQWRkIHNlcnZlciBjb25maWd1cmF0aW9uIGZvciBkZXZlbG9wbWVudFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogNTE3MyxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUElfVVJMIHx8IFwiaHR0cDovL2xvY2FsaG9zdDo3Nzg3XCIsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlwiKSxcbiAgICAgICAgICBjb25maWd1cmU6IChwcm94eSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgcHJveHkub24oXCJlcnJvclwiLCAoZXJyLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUHJveHkgRXJyb3I6XCIsIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByb3h5Lm9uKFwicHJveHlSZXFcIiwgKHByb3h5UmVxLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgUmVxdWVzdDpcIiwgcmVxLm1ldGhvZCwgcmVxLnVybCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogW1widnVlMy1hcGV4Y2hhcnRzXCIsIFwiYXBleGNoYXJ0c1wiXSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBvdXREaXI6IFwiZGlzdFwiLFxuICAgICAgYXNzZXRzRGlyOiBcImFzc2V0c1wiLFxuICAgICAgc291cmNlbWFwOiBjb21tYW5kID09PSBcInNlcnZlXCIsXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwMDAsXG4gICAgICAvLyBPcHRpbWl6ZSBjaHVua3NcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICBcInZ1ZS12ZW5kb3JcIjogW1widnVlXCIsIFwidnVlLXJvdXRlclwiLCBcInBpbmlhXCJdLFxuICAgICAgICAgICAgXCJjaGFydC12ZW5kb3JcIjogW1wiY2hhcnQuanNcIiwgXCJhcGV4Y2hhcnRzXCIsIFwidnVlMy1hcGV4Y2hhcnRzXCJdLFxuICAgICAgICAgICAgXCJjb3JlLXZlbmRvclwiOiBbXCJAdnVldXNlL2NvcmVcIiwgXCJheGlvc1wiXSxcbiAgICAgICAgICAgIFwidWktdmVuZG9yXCI6IFtcbiAgICAgICAgICAgICAgXCJAaGVhZGxlc3N1aS92dWVcIixcbiAgICAgICAgICAgICAgXCJAaGVyb2ljb25zL3Z1ZVwiLFxuICAgICAgICAgICAgICBcImx1Y2lkZS12dWUtbmV4dFwiLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUuZW5kc1dpdGgoXCIuY3NzXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcImFzc2V0cy9jc3MvW25hbWVdLVtoYXNoXVtleHRuYW1lXVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFwiYXNzZXRzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV1cIjtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBleHRlcm5hbDogW1wianNiYXJjb2RlL2Jpbi9Kc0JhcmNvZGUuYWxsLm1pbi5qc1wiXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBPcHRpb25hbDogQWRkIHByZXZpZXcgY29uZmlndXJhdGlvblxuICAgIHByZXZpZXc6IHtcbiAgICAgIHBvcnQ6IDQxNzMsXG4gICAgICBob3N0OiB0cnVlLFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlUsT0FBTyxVQUFVO0FBQzVWLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8sU0FBUztBQUNoQixPQUFPLGNBQWM7QUFDckIsT0FBTyxrQkFBa0I7QUFDekIsU0FBUyxjQUFjO0FBTHZCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFFakQsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLHFCQUFxQjtBQUFBLE1BQ3JCLHVCQUF1QjtBQUFBLE1BQ3ZCLGVBQWUsQ0FBQztBQUFBO0FBQUEsTUFFaEIsNENBQTRDLEtBQUs7QUFBQSxRQUMvQyxJQUFJO0FBQUEsTUFDTjtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxRQUNQLFNBQVMsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUFBLElBQ3pCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsV0FBVztBQUFBO0FBQUEsSUFFWCxRQUFRLEtBQUssUUFBUSxnQ0FBUztBQUFBO0FBQUEsSUFFOUIsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUSxJQUFJLGdCQUFnQjtBQUFBLFVBQzVCLGNBQWM7QUFBQSxVQUNkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLFVBQzVDLFdBQVcsQ0FBQyxPQUFPLFlBQVk7QUFDN0Isa0JBQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxLQUFLLFFBQVE7QUFDbkMsc0JBQVEsTUFBTSxnQkFBZ0IsR0FBRztBQUFBLFlBQ25DLENBQUM7QUFDRCxrQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssUUFBUTtBQUMzQyxzQkFBUSxJQUFJLG9CQUFvQixJQUFJLFFBQVEsSUFBSSxHQUFHO0FBQUEsWUFDckQsQ0FBQztBQUFBLFVBQ0g7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxtQkFBbUIsWUFBWTtBQUFBLElBQzNDO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxXQUFXLFlBQVk7QUFBQSxNQUN2Qix1QkFBdUI7QUFBQTtBQUFBLE1BRXZCLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQSxVQUNOLGNBQWM7QUFBQSxZQUNaLGNBQWMsQ0FBQyxPQUFPLGNBQWMsT0FBTztBQUFBLFlBQzNDLGdCQUFnQixDQUFDLFlBQVksY0FBYyxpQkFBaUI7QUFBQSxZQUM1RCxlQUFlLENBQUMsZ0JBQWdCLE9BQU87QUFBQSxZQUN2QyxhQUFhO0FBQUEsY0FDWDtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLGdCQUFnQixDQUFDLGNBQWM7QUFDN0IsZ0JBQUksVUFBVSxLQUFLLFNBQVMsTUFBTSxHQUFHO0FBQ25DLHFCQUFPO0FBQUEsWUFDVDtBQUNBLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxRQUNBLFVBQVUsQ0FBQyxvQ0FBb0M7QUFBQSxNQUNqRDtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
