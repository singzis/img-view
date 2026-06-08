/// <reference types="vite/client" />

interface ImgViewAPI {
  selectDirectory: () => Promise<string | null>;
}

declare global {
  interface Window {
    imgview?: ImgViewAPI;
  }
}

export {};
