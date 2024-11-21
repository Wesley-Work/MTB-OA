export default {
    "compilerOptions": {
      "jsx": "preserve",
      "jsxFactory": "h",
      "jsxFragmentFactory": "Fragment",
      "moduleResolution": "node",
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "strict": true,
      "target": "esnext",
      "module": "esnext",
      "lib": ["esnext", "dom"],
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      },
      "types": ["vite/client"]
    },
    "include": ["vite-env.d.ts", "src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
    "exclude": ["node_modules"]
}