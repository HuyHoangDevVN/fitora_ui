import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@pages": "/src/pages",
      "@components": "/src/components",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@styles": "/src/styles",
      "@layouts": "/src/layouts",
    },
  },
});
