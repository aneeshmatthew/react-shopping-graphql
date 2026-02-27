/**
 * Vite Configuration — react-shopping-graphql
 *
 * This file controls how the app is built and served during development.
 * Vite uses Rollup under the hood for production builds.
 *
 * Key responsibilities:
 *  - Define the public base path for GitHub Pages hosting
 *  - Register plugins (React, compression, bundle analysis)
 *  - Configure production build optimizations (minification, code splitting)
 *  - Pre-bundle dependencies that need special handling (Apollo Client)
 *
 * Useful commands:
 *  npm run dev      → starts the local dev server at http://localhost:5173
 *  npm run build    → creates an optimized production build in /dist
 *  npm run analyze  → builds + opens bundle-stats.html (shows bundle size breakdown)
 *  npm run preview  → serves the /dist build locally to test before deploying
 *
 * NOT YET APPLIED — future optimizations documented below:
 *  - Virtual scrolling  → for very large product lists without pagination
 *  - Image optimization → for locally stored images (not needed for API images)
 *  See the bottom of this file for full documentation on both.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

/**
 * ANALYZE mode flag.
 * When true, the bundle visualizer plugin is activated.
 *
 * Usage:
 *   npm run analyze
 *   → runs: ANALYZE=true vite build
 *   → generates bundle-stats.html at the project root
 *   → opens an interactive treemap in the browser showing each package's size
 *
 * Use this to identify which libraries are bloating the bundle
 * before deciding what to optimize or replace.
 */
const isAnalyze = process.env.ANALYZE === 'true';

export default defineConfig({
  /**
   * base — the public URL path where the app is served.
   *
   * Must match the GitHub repository name because GitHub Pages serves
   * the app at: https://<username>.github.io/<repo-name>/
   *
   * Without this, all asset URLs (JS, CSS, images) would be relative
   * to the root ("/") and return 404 on GitHub Pages.
   *
   * Change this if you rename the repo or deploy to a custom domain (use "/").
   */
  base: '/react-shopping-graphql/',

  /**
   * plugins — Vite plugins that extend the build pipeline.
   *
   * Plugins run in order. The .filter(Boolean) at the end removes
   * any falsy values (e.g. the visualizer when isAnalyze is false).
   */
  plugins: [
    /**
     * @vitejs/plugin-react
     * Adds JSX support and React Fast Refresh (HMR that preserves component state).
     * Required for any React project using Vite.
     */
    react(),

    /**
     * vite-plugin-compression — Brotli
     * After the build, creates a compressed .br copy of every JS and CSS file.
     * Brotli typically achieves 15–25% better compression than gzip.
     *
     * Example: apollo.js (186KB) → apollo.js.br (46KB)
     *
     * Modern CDNs and servers (Cloudflare, Netlify, Nginx with brotli module)
     * serve .br files automatically when the browser supports it (all modern browsers do).
     * The original .js file is kept as a fallback.
     */
    compression({ algorithm: 'brotliCompress', ext: '.br' }),

    /**
     * vite-plugin-compression — Gzip
     * Creates a compressed .gz copy as a fallback for servers that don't support brotli.
     * Gzip is supported by virtually every web server and CDN.
     *
     * Example: apollo.js (186KB) → apollo.js.gz (52KB)
     */
    compression({ algorithm: 'gzip', ext: '.gz' }),

    /**
     * rollup-plugin-visualizer
     * Only activated when running: npm run analyze (ANALYZE=true)
     *
     * Generates bundle-stats.html — an interactive treemap showing:
     *  - Every package in the bundle and its raw size
     *  - Gzip and Brotli sizes side by side
     *  - Which chunks each module ended up in
     *
     * Not included in normal builds to avoid slowing down CI pipelines.
     */
    isAnalyze && visualizer({
      filename: 'bundle-stats.html',
      open: true,       // auto-opens in browser after build
      gzipSize: true,   // shows gzip size alongside raw size
      brotliSize: true, // shows brotli size alongside raw size
    }),
  ].filter(Boolean),

  /**
   * build — production build settings (only applies to `npm run build`).
   * Has no effect on the dev server.
   */
  build: {
    /**
     * minify: 'terser'
     * Switches the minifier from the default esbuild to Terser.
     *
     * esbuild is faster but Terser produces slightly smaller output
     * and supports advanced compression options like drop_console.
     *
     * Requires the `terser` package to be installed as a dev dependency.
     */
    minify: 'terser',

    /**
     * terserOptions — configuration passed directly to Terser.
     */
    terserOptions: {
      compress: {
        /**
         * drop_console
         * Removes all console.log(), console.warn(), console.error() calls
         * from the production bundle.
         *
         * Benefits:
         *  - Slightly smaller bundle (removes log strings and calls)
         *  - Prevents internal debug messages from being visible to users
         *    in browser DevTools
         */
        drop_console: true,

        /**
         * drop_debugger
         * Removes all `debugger` statements from the production bundle.
         * Prevents accidental breakpoints from reaching production.
         */
        drop_debugger: true,

        /**
         * pure_funcs
         * Marks these functions as "pure" (no side effects).
         * Terser will remove calls to them if their return value is unused.
         * Catches any console calls not covered by drop_console.
         */
        pure_funcs: ['console.info', 'console.debug'],
      },
    },

    /**
     * rollupOptions — passed directly to Rollup, the bundler Vite uses.
     */
    rollupOptions: {
      output: {
        /**
         * manualChunks — splits specific libraries into their own JS files.
         *
         * WHY THIS MATTERS FOR CACHING:
         * Browsers cache JS files by filename. When you deploy a new version,
         * Vite adds a content hash to filenames (e.g. apollo-B6mPe2es.js).
         * Only files whose content changed get a new hash — so only those
         * files need to be re-downloaded by users.
         *
         * Without manualChunks, ALL code (your app + all libraries) is in
         * one chunk. Any small bug fix forces users to re-download everything.
         *
         * With manualChunks:
         *  - Fix a bug in CartPage.jsx → only CartPage-[hash].js re-downloads (~5KB)
         *  - apollo-[hash].js (186KB), redux-[hash].js (25KB) stay cached
         *
         * Current chunks:
         *  react-vendor → react, react-dom, react-router-dom  (~47KB)
         *  apollo       → @apollo/client, graphql             (~186KB)
         *  redux        → @reduxjs/toolkit, react-redux       (~25KB)
         *  index        → your app code                       (~189KB)
         *  + one chunk per lazy-loaded page (HomePage, CartPage, ProductDetailPage)
         */
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'apollo': ['@apollo/client', '@apollo/client/react', 'graphql'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },

    /**
     * chunkSizeWarningLimit
     * Vite prints a warning in the build output if any single chunk
     * exceeds this size (in KB). Default is 500KB.
     *
     * This is a warning only — it does not fail the build.
     * Use it as a signal to investigate with `npm run analyze`.
     */
    chunkSizeWarningLimit: 500,
  },

  /**
   * optimizeDeps — controls Vite's dependency pre-bundling.
   *
   * Vite pre-bundles dependencies during dev server startup to:
   *  1. Convert CommonJS modules to ES Modules (which browsers require)
   *  2. Merge many small files into fewer requests for faster dev loading
   *
   * WHY APOLLO IS LISTED HERE:
   * @apollo/client has an unusual module structure where React hooks
   * (useQuery, useMutation) live in a sub-path (@apollo/client/react)
   * rather than the main entry point. Without explicitly including both,
   * Vite's bundler resolves to the core package and misses the React hooks,
   * causing "useQuery is not exported" build errors.
   */
  optimizeDeps: {
    include: ['@apollo/client', '@apollo/client/react'],
  },
});

// =============================================================================
// FUTURE OPTIMIZATIONS — NOT YET APPLIED
// =============================================================================
// These are documented here for reference. They are not currently needed for
// this project but become relevant as the app scales.
// =============================================================================

/**
 * VIRTUAL SCROLLING
 * ─────────────────
 * WHY IT'S NOT NEEDED NOW:
 * This project uses offset pagination (12 items per page). The DOM never holds
 * more than 12 product cards at once, so rendering performance is not an issue.
 *
 * WHEN YOU WOULD NEED IT:
 * If you remove pagination and render all 53+ products at once (or the
 * catalogue grows to hundreds of items), the browser has to create and track
 * hundreds of DOM nodes simultaneously. Scrolling becomes janky and initial
 * render is slow. Virtual scrolling solves this by only rendering the cards
 * currently visible in the viewport — typically 10–15 at a time — regardless
 * of how many items exist in the list.
 *
 * HOW IT WORKS:
 * A virtual list measures the scroll container and calculates which items fall
 * within the visible window. As the user scrolls, it swaps in new items and
 * removes off-screen ones from the DOM. The scroll bar still behaves as if all
 * items exist (using placeholder height), but only visible items are real nodes.
 *
 * RECOMMENDED LIBRARY:
 *   @tanstack/react-virtual  — lightweight, framework-agnostic, works with any
 *                              layout (vertical list, grid, horizontal scroll)
 *
 * SETUP:
 *   npm install @tanstack/react-virtual
 *
 * USAGE IN HomePage.jsx:
 *
 *   import { useVirtualizer } from '@tanstack/react-virtual';
 *   import { useRef } from 'react';
 *
 *   const parentRef = useRef(null);
 *
 *   const rowVirtualizer = useVirtualizer({
 *     count: results.length,            // total number of items
 *     getScrollElement: () => parentRef.current,
 *     estimateSize: () => 320,          // estimated card height in px
 *     overscan: 4,                      // render 4 extra items above/below viewport
 *                                       // prevents blank flashes during fast scrolling
 *   });
 *
 *   return (
 *     <div ref={parentRef} style={{ height: '100vh', overflow: 'auto' }}>
 *       <div style={{ height: rowVirtualizer.getTotalSize() }}>
 *         {rowVirtualizer.getVirtualItems().map((virtualItem) => (
 *           <div
 *             key={virtualItem.key}
 *             style={{
 *               position: 'absolute',
 *               top: virtualItem.start,
 *               width: '100%',
 *             }}
 *           >
 *             <ProductCard product={results[virtualItem.index]} />
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 *
 * NO VITE CONFIG CHANGES NEEDED — this is a React-level change only.
 * The library is installed as a regular dependency, not a Vite plugin.
 */

// =============================================================================

/**
 * IMAGE OPTIMIZATION PLUGIN
 * ─────────────────────────
 * WHY IT'S NOT NEEDED NOW:
 * All product images in this project are served directly from the Vendure API:
 *   https://demo.vendure.io/assets/preview/...
 *
 * The API handles resizing server-side via URL query parameters:
 *   src={`${productAsset.preview}?w=400&h=400`}
 *
 * This means the browser only downloads a 400×400 image, not the full-size
 * original. No local image files exist in this project to optimize.
 *
 * WHEN YOU WOULD NEED IT:
 * If you add local images to the project — hero banners, brand logos, category
 * illustrations, placeholder images stored in /src/assets/ or /public/ —
 * those would be copied to /dist unoptimized by default. Large uncompressed
 * PNGs or JPEGs would bloat the bundle and slow down page load.
 *
 * HOW IT WORKS:
 * The plugin runs during `npm run build` and processes every image file it finds.
 * It recompresses them using lossy/lossless algorithms (mozjpeg, optipng, svgo)
 * and optionally converts them to modern formats like WebP or AVIF, which are
 * 30–50% smaller than JPEG/PNG at equivalent visual quality.
 *
 * RECOMMENDED LIBRARY:
 *   vite-plugin-imagemin  — wraps multiple image compression tools in one plugin
 *
 * SETUP:
 *   npm install --save-dev vite-plugin-imagemin
 *
 * VITE CONFIG CHANGES NEEDED:
 * Add to the imports at the top of this file:
 *   import imagemin from 'vite-plugin-imagemin';
 *
 * Add to the plugins array:
 *   imagemin({
 *     gifsicle: { optimizationLevel: 3 },
 *     mozjpeg:  { quality: 80 },          // 80% quality — visually lossless for most images
 *     pngquant: { quality: [0.8, 0.9] },  // lossy PNG compression
 *     svgo: {                             // SVG optimization
 *       plugins: [
 *         { name: 'removeViewBox', active: false },
 *         { name: 'removeEmptyAttrs', active: true },
 *       ],
 *     },
 *     webp: { quality: 80 },              // generate .webp alongside originals
 *   }),
 *
 * ALTERNATIVE — vite-imagetools (more flexible):
 *   Allows per-image transformation via URL query params in your JSX:
 *     import heroImage from './assets/hero.jpg?w=1200&format=webp&quality=85';
 *   Gives you fine-grained control without a global compression config.
 *
 * NOTE ON API IMAGES:
 * Images fetched at runtime from a URL (like the Vendure API) cannot be
 * optimized at build time — the plugin only processes files present in the
 * project at build time. For API images, rely on server-side resizing
 * (the ?w=&h= params already used in this project) or a CDN image service
 * like Cloudflare Images or Imgix.
 */
