// import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default {
  optimizeDeps: {
    allowNodeBuiltins: ["pouchdb-browser", "pouchdb-utils", "pouchdb"],
    esbuildOptions: {
      // Node.js global to browser globalThis
      //https://gist.github.com/FbN/0e651105937c8000f10fefdf9ec9af3d
      // indispensable para poder importar pouchdb en el service worker
      //
      define: {
        global: "globalThis",
      },
    },
  },
  plugins: [react()],
};
