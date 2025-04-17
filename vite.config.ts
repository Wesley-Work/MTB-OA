import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { plugin as mdPlugin } from 'vite-plugin-markdown';
// import { Mode } from 'vite-plugin-markdown';
const srcRootPath = path.resolve(__dirname, './src');

// https://vite.dev/config/
export default defineConfig({
  envDir: './',
  envPrefix: 'VITE_',
  resolve: {
    alias: {
      '@': srcRootPath,
      '@utils': path.resolve(srcRootPath, 'utils'),
      '@hooks': path.resolve(srcRootPath, 'hooks'),
      '@pages': path.resolve(srcRootPath, 'pages'),
      '@components': path.resolve(srcRootPath, 'components'),
      '@types': path.resolve(srcRootPath, 'types'),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    mdPlugin({
      mode: 'html',
    }),
  ],
});
