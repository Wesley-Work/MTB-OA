import { defineConfig } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vite.dev/config/
export default defineConfig({
  envDir: './',
  envPrefix: 'VITE_',
  plugins: [
    vue(),
    vueJsx()
  ],
})
