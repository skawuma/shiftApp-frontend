import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular'; // or '@vitejs/plugin-angular' if you're not using Analog

export default defineConfig({
  plugins: [angular()],
  server: {
    host: '0.0.0.0',
    port: 4200,
    allowedHosts: ['samuels-macbook-pro.local']
  }
});
