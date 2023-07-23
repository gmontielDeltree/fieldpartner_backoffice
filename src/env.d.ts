/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AUTH_API: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }