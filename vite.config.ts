import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import r3fTransformPlugin from "./vite-plugin-r3f-transform"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), r3fTransformPlugin()],
  server: {
    hmr: true  // Make sure HMR is enabled
  }
})
