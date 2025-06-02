import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
      "@pages": "/src/pages",
      "@components": "/src/components",
      "@api": "/src/api",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@styles": "/src/styles",
      "@layouts": "/src/layouts",
      "@features": "/src/features",
      "@store": "/src/store",
      "@types": "/src/types",
    },
  },
});
