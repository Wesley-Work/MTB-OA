import { defineConfig } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { plugin as mdPlugin } from 'vite-plugin-markdown';
import { Mode } from 'vite-plugin-markdown'

// https://vite.dev/config/
export default defineConfig({
  envDir: './',
  envPrefix: 'VITE_',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    mdPlugin({
      mode: "html",
    })
  ],
})
