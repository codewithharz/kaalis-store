// vite.config.js
import path from "path";
import { defineConfig, loadEnv } from "file:///Users/harz/Downloads/kaalis-store/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/harz/Downloads/kaalis-store/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import tailwind from "file:///Users/harz/Downloads/kaalis-store/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///Users/harz/Downloads/kaalis-store/node_modules/autoprefixer/lib/autoprefixer.js";
import { qrcode } from "file:///Users/harz/Downloads/kaalis-store/node_modules/vite-plugin-qrcode/dist/index.js";
var __vite_injected_original_dirname = "/Users/harz/Downloads/kaalis-store/frontend";
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
      // Optimize chunks
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["vue", "vue-router", "pinia", "@vueuse/core", "axios"]
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaGFyei9Eb3dubG9hZHMva2FhbGlzLXN0b3JlL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvaGFyei9Eb3dubG9hZHMva2FhbGlzLXN0b3JlL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9oYXJ6L0Rvd25sb2Fkcy9rYWFsaXMtc3RvcmUvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjsvLyAvLyBpbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XG4vLyAvLyBpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuLy8gLy8gaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG4vLyAvLyBpbXBvcnQgdGFpbHdpbmQgZnJvbSBcInRhaWx3aW5kY3NzXCI7XG4vLyAvLyBpbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gXCJhdXRvcHJlZml4ZXJcIjtcbi8vIC8vIGltcG9ydCB7IHFyY29kZSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1xcmNvZGVcIjtcblxuLy8gLy8gZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbi8vIC8vICAgZGVmaW5lOiB7XG4vLyAvLyAgICAgXCJwcm9jZXNzLmVudlwiOiB7fSxcbi8vIC8vICAgfSxcbi8vIC8vICAgY3NzOiB7XG4vLyAvLyAgICAgcG9zdGNzczoge1xuLy8gLy8gICAgICAgcGx1Z2luczogW3RhaWx3aW5kKCksIGF1dG9wcmVmaXhlcigpXSxcbi8vIC8vICAgICB9LFxuLy8gLy8gICB9LFxuLy8gLy8gICBwbHVnaW5zOiBbdnVlKCksIHFyY29kZSgpXSxcbi8vIC8vICAgcmVzb2x2ZToge1xuLy8gLy8gICAgIGFsaWFzOiB7XG4vLyAvLyAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbi8vIC8vICAgICB9LFxuLy8gLy8gICB9LFxuLy8gLy8gfSk7XG5cbi8vIGltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG4vLyBpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xuLy8gaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG4vLyBpbXBvcnQgdGFpbHdpbmQgZnJvbSBcInRhaWx3aW5kY3NzXCI7XG4vLyBpbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gXCJhdXRvcHJlZml4ZXJcIjtcbi8vIGltcG9ydCB7IHFyY29kZSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1xcmNvZGVcIjtcblxuLy8gZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuLy8gICAvLyBMb2FkIGVudiBmaWxlIGJhc2VkIG9uIGBtb2RlYCBpbiB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeVxuLy8gICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksIFwiXCIpO1xuXG4vLyAgIHJldHVybiB7XG4vLyAgICAgZGVmaW5lOiB7XG4vLyAgICAgICBfX1ZVRV9PUFRJT05TX0FQSV9fOiB0cnVlLFxuLy8gICAgICAgX19WVUVfUFJPRF9ERVZUT09MU19fOiBmYWxzZSxcbi8vICAgICAgIFwicHJvY2Vzcy5lbnZcIjoge30sXG4vLyAgICAgICAvLyBFeHBvc2UgUGF5c3RhY2sga2V5IHRvIHRoZSBhcHBcbi8vICAgICAgIFwiaW1wb3J0Lm1ldGEuZW52LlZJVEVfUEFZU1RBQ0tfUFVCTElDX0tFWVwiOiBKU09OLnN0cmluZ2lmeShcbi8vICAgICAgICAgZW52LlZJVEVfUEFZU1RBQ0tfUFVCTElDX0tFWVxuLy8gICAgICAgKSxcbi8vICAgICB9LFxuLy8gICAgIGNzczoge1xuLy8gICAgICAgcG9zdGNzczoge1xuLy8gICAgICAgICBwbHVnaW5zOiBbdGFpbHdpbmQoKSwgYXV0b3ByZWZpeGVyKCldLFxuLy8gICAgICAgfSxcbi8vICAgICB9LFxuLy8gICAgIHBsdWdpbnM6IFt2dWUoKSwgcXJjb2RlKCldLFxuLy8gICAgIHJlc29sdmU6IHtcbi8vICAgICAgIGFsaWFzOiB7XG4vLyAgICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuLy8gICAgICAgfSxcbi8vICAgICB9LFxuLy8gICAgIC8vIEFkZCBlbnYgY29uZmlndXJhdGlvblxuLy8gICAgIGVudlByZWZpeDogXCJWSVRFX1wiLFxuLy8gICAgIC8vIE9wdGlvbmFsOiBBZGQgZW52IGRpcmVjdG9yeSBjb25maWd1cmF0aW9uXG4vLyAgICAgZW52RGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lKSxcbi8vICAgfTtcbi8vIH0pO1xuXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHRhaWx3aW5kIGZyb20gXCJ0YWlsd2luZGNzc1wiO1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tIFwiYXV0b3ByZWZpeGVyXCI7XG5pbXBvcnQgeyBxcmNvZGUgfSBmcm9tIFwidml0ZS1wbHVnaW4tcXJjb2RlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgLy8gTG9hZCBlbnYgZmlsZSBiYXNlZCBvbiBgbW9kZWAgaW4gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnlcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKTtcblxuICByZXR1cm4ge1xuICAgIGRlZmluZToge1xuICAgICAgX19WVUVfT1BUSU9OU19BUElfXzogdHJ1ZSxcbiAgICAgIF9fVlVFX1BST0RfREVWVE9PTFNfXzogZmFsc2UsXG4gICAgICBcInByb2Nlc3MuZW52XCI6IHt9LFxuICAgICAgLy8gRXhwb3NlIFBheXN0YWNrIGtleSB0byB0aGUgYXBwXG4gICAgICBcImltcG9ydC5tZXRhLmVudi5WSVRFX1BBWVNUQUNLX1BVQkxJQ19LRVlcIjogSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIGVudi5WSVRFX1BBWVNUQUNLX1BVQkxJQ19LRVlcbiAgICAgICksXG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW3RhaWx3aW5kKCksIGF1dG9wcmVmaXhlcigpXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbdnVlKCksIHFyY29kZSgpXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBBZGQgZW52IGNvbmZpZ3VyYXRpb25cbiAgICBlbnZQcmVmaXg6IFwiVklURV9cIixcbiAgICAvLyBPcHRpb25hbDogQWRkIGVudiBkaXJlY3RvcnkgY29uZmlndXJhdGlvblxuICAgIGVudkRpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSksXG4gICAgLy8gQWRkIHNlcnZlciBjb25maWd1cmF0aW9uIGZvciBkZXZlbG9wbWVudFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogNTE3MyxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUElfVVJMIHx8IFwiaHR0cDovL2xvY2FsaG9zdDo3Nzg3XCIsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlwiKSxcbiAgICAgICAgICBjb25maWd1cmU6IChwcm94eSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgcHJveHkub24oXCJlcnJvclwiLCAoZXJyLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUHJveHkgRXJyb3I6XCIsIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHByb3h5Lm9uKFwicHJveHlSZXFcIiwgKHByb3h5UmVxLCByZXEsIHJlcykgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgUmVxdWVzdDpcIiwgcmVxLm1ldGhvZCwgcmVxLnVybCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogW1widnVlMy1hcGV4Y2hhcnRzXCIsIFwiYXBleGNoYXJ0c1wiXSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBvdXREaXI6IFwiZGlzdFwiLFxuICAgICAgYXNzZXRzRGlyOiBcImFzc2V0c1wiLFxuICAgICAgc291cmNlbWFwOiBjb21tYW5kID09PSBcInNlcnZlXCIsXG4gICAgICAvLyBPcHRpbWl6ZSBjaHVua3NcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICB2ZW5kb3I6IFtcInZ1ZVwiLCBcInZ1ZS1yb3V0ZXJcIiwgXCJwaW5pYVwiLCBcIkB2dWV1c2UvY29yZVwiLCBcImF4aW9zXCJdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGV4dGVybmFsOiBbXCJqc2JhcmNvZGUvYmluL0pzQmFyY29kZS5hbGwubWluLmpzXCJdLFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIE9wdGlvbmFsOiBBZGQgcHJldmlldyBjb25maWd1cmF0aW9uXG4gICAgcHJldmlldzoge1xuICAgICAgcG9ydDogNDE3MyxcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQStEQSxPQUFPLFVBQVU7QUFDakIsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sY0FBYztBQUNyQixPQUFPLGtCQUFrQjtBQUN6QixTQUFTLGNBQWM7QUFwRXZCLElBQU0sbUNBQW1DO0FBc0V6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsS0FBSyxNQUFNO0FBRWpELFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUUzQyxTQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDTixxQkFBcUI7QUFBQSxNQUNyQix1QkFBdUI7QUFBQSxNQUN2QixlQUFlLENBQUM7QUFBQTtBQUFBLE1BRWhCLDRDQUE0QyxLQUFLO0FBQUEsUUFDL0MsSUFBSTtBQUFBLE1BQ047QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsUUFDUCxTQUFTLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7QUFBQSxJQUN6QixTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLFdBQVc7QUFBQTtBQUFBLElBRVgsUUFBUSxLQUFLLFFBQVEsZ0NBQVM7QUFBQTtBQUFBLElBRTlCLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVEsSUFBSSxnQkFBZ0I7QUFBQSxVQUM1QixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxVQUM1QyxXQUFXLENBQUMsT0FBTyxZQUFZO0FBQzdCLGtCQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssS0FBSyxRQUFRO0FBQ25DLHNCQUFRLE1BQU0sZ0JBQWdCLEdBQUc7QUFBQSxZQUNuQyxDQUFDO0FBQ0Qsa0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFFBQVE7QUFDM0Msc0JBQVEsSUFBSSxvQkFBb0IsSUFBSSxRQUFRLElBQUksR0FBRztBQUFBLFlBQ3JELENBQUM7QUFBQSxVQUNIO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsbUJBQW1CLFlBQVk7QUFBQSxJQUMzQztBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsV0FBVyxZQUFZO0FBQUE7QUFBQSxNQUV2QixlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixjQUFjO0FBQUEsWUFDWixRQUFRLENBQUMsT0FBTyxjQUFjLFNBQVMsZ0JBQWdCLE9BQU87QUFBQSxVQUNoRTtBQUFBLFFBQ0Y7QUFBQSxRQUNBLFVBQVUsQ0FBQyxvQ0FBb0M7QUFBQSxNQUNqRDtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
