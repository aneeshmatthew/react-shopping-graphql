import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Base path must match the GitHub repo name for GitHub Pages to serve assets correctly
  base: '/react-shopping-graphql/',
  plugins: [react()],
  optimizeDeps: {
    include: ['@apollo/client', '@apollo/client/react'],
  },
})
