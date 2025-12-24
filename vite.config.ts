import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Porta para o ambiente de desenvolvimento
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    port: 80, // Porta para o servidor de preview (simulando o Nginx no Docker)
    strictPort: true, // Garante que a porta 80 será usada se disponível
  },
});
