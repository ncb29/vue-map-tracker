import { fileURLToPath, URL } from 'node:url'
import path from "path";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // isCustomElement: (tag) => ['Header', 'Map', 'Footer'].includes(tag),
        }
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
        
        assetFileNames: ({name}) => {          
          
          if (/\.css$/.test(name ?? '')) {
              return 'assets/css/[name][extname]';   
          }

          // if (/\.css$/.test(name ?? '')) {
          //     return 'assets/images/[name][extname]';
          // }
 
          // default value
          // ref: https://rollupjs.org/guide/en/#outputassetfilenames
          return 'assets/[name][extname]';
        },
      },
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
