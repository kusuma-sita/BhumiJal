import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Seeded PRNG for API mock in dev server
function createPRNG(seed: number) {
  let s = Math.floor(Math.abs(seed));
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getSeed(lat: number, lon: number): number {
  const latInt = Math.round(lat * 1000);
  const lonInt = Math.round(lon * 1000);
  return (latInt * 73856093) ^ (lonInt * 19349663);
}

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const parsedUrl = new URL(req.url, 'http://localhost:3000');
        const pathname = parsedUrl.pathname;
        const lat = parseFloat(parsedUrl.searchParams.get('lat') || '21.1458');
        const lon = parseFloat(parsedUrl.searchParams.get('lon') || '79.0882');

        res.setHeader('Content-Type', 'application/json');

        if (pathname === '/api/weather') {
          const rand = createPRNG(getSeed(lat, lon) + 101);
          const rainfall_14days: number[] = [];
          let totalRainfall = 0;
          for (let i = 0; i < 14; i++) {
            const isRainy = rand() > 0.55;
            const rain = isRainy ? Math.round(rand() * 48 * 10) / 10 : (rand() > 0.7 ? Math.round(rand() * 4 * 10) / 10 : 0);
            rainfall_14days.push(rain);
            totalRainfall += rain;
          }
          const temperature = Math.round((20 + rand() * 20) * 10) / 10;
          const humidity = Math.round(40 + rand() * 40);
          res.end(JSON.stringify({
            rainfall_14days,
            temperature,
            humidity,
            total_rainfall: Math.round(totalRainfall * 10) / 10,
            source: 'NASA POWER',
          }));
          return;
        }

        if (pathname === '/api/groundwater') {
          const rand = createPRNG(getSeed(lat, lon) + 202);
          const current_level = Math.round((5 + rand() * 25) * 10) / 10;
          let stress_category: string;
          let soe_percentage: number;
          if (current_level < 10) {
            stress_category = 'Safe';
            soe_percentage = Math.round(42 + rand() * 25);
          } else if (current_level <= 15) {
            stress_category = 'Semi-Critical';
            soe_percentage = Math.round(71 + rand() * 18);
          } else if (current_level <= 20) {
            stress_category = 'Critical';
            soe_percentage = Math.round(91 + rand() * 9);
          } else {
            stress_category = 'Over-Exploited';
            soe_percentage = Math.round(102 + rand() * 38);
          }

          const monthNames = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
          const now = new Date();
          const forecast_4months = [];
          let level = current_level;
          for (let i = 1; i <= 4; i++) {
            const m = (now.getMonth() + i) % 12;
            level = Math.max(3.5, Math.min(35, Math.round((level + (rand() - 0.45) * 1.8) * 10) / 10));
            forecast_4months.push({
              month: `${monthNames[m]} ${now.getFullYear() + (now.getMonth() + i >= 12 ? 1 : 0)}`,
              level,
            });
          }

          res.end(JSON.stringify({
            current_level,
            stress_category,
            forecast_4months,
            soe_percentage,
            source: 'CGWB',
          }));
          return;
        }

        if (pathname === '/api/soil') {
          const rand = createPRNG(getSeed(lat, lon) + 303);
          const nitrogen = Math.round(20 + rand() * 60);
          const phosphorus = Math.round(20 + rand() * 60);
          const potassium = Math.round(20 + rand() * 60);
          const ph = Math.round((5.5 + rand() * 2.9) * 10) / 10;
          const soilTypes = [
            'Black Soil',
            'Alluvial Soil',
            'Red & Yellow Soil',
            'Laterite Soil',
            'Arid / Sandy Loam',
          ];
          const soil_type = soilTypes[Math.floor(rand() * soilTypes.length)];
          res.end(JSON.stringify({
            nitrogen,
            phosphorus,
            potassium,
            ph,
            soil_type,
            source: 'Soil Health Card',
          }));
          return;
        }

        if (pathname === '/api/crops') {
          const rand = createPRNG(getSeed(lat, lon) + 202);
          const current_level = 5 + rand() * 25;
          if (current_level > 15) {
            res.end(JSON.stringify({
              recommended: [
                { name: 'Pearl Millet (Bajra)', water_saving: 'Save 65% water', yield: '2.4 - 3.1 t/ha' },
                { name: 'Sorghum (Jowar)', water_saving: 'Save 55% water', yield: '2.8 - 3.5 t/ha' },
                { name: 'Chickpea (Chana)', water_saving: 'Save 50% water', yield: '1.5 - 2.0 t/ha' },
              ],
              avoid: [
                { name: 'Paddy', reason: 'Needs 120-150 days of flood water; causes severe groundwater depletion' },
                { name: 'Sugarcane', reason: 'High water footprint (1800-2200 mm), exhausts aquifer reserve' },
              ],
            }));
          } else {
            res.end(JSON.stringify({
              recommended: [
                { name: 'Mustard / Rapeseed', water_saving: 'Save 45% water', yield: '1.8 - 2.3 t/ha' },
                { name: 'Finger Millet (Ragi)', water_saving: 'Save 60% water', yield: '2.2 - 2.9 t/ha' },
                { name: 'Groundnut', water_saving: 'Save 40% water', yield: '2.5 - 3.2 t/ha' },
              ],
              avoid: [
                { name: 'Summer Paddy', reason: 'High evaporation rate during dry hot months' },
              ],
            }));
          }
          return;
        }

        if (pathname === '/api/alerts') {
          const rand = createPRNG(getSeed(lat, lon) + 202);
          const current_level = Math.round((5 + rand() * 25) * 10) / 10;
          const alerts = [];

          if (current_level > 20) {
            alerts.push({
              type: 'Groundwater Crisis',
              severity: 'critical',
              message: '🔴 Stage of Extraction: Over-Exploited (105%). Urgent action needed: halt new borewell drilling.',
              icon: 'AlertOctagon',
            });
            alerts.push({
              type: 'Crop Adaptation',
              severity: 'high',
              message: '⚠️ Groundwater level is LOW. Switch to drought-resistant crops.',
              icon: 'AlertTriangle',
            });
          } else if (current_level > 15) {
            alerts.push({
              type: 'Aquifer Stress',
              severity: 'high',
              message: `🟠 Groundwater depth is ${current_level}m. Water extraction is critical.`,
              icon: 'AlertTriangle',
            });
          } else if (current_level > 10) {
            alerts.push({
              type: 'Water Advisory',
              severity: 'moderate',
              message: `🟡 Semi-Critical zone (${current_level}m). Plan micro-irrigation systems.`,
              icon: 'Info',
            });
          } else {
            alerts.push({
              type: 'Aquifer Safe',
              severity: 'safe',
              message: `🟢 Groundwater level is safe (${current_level}m below ground). Maintain recharge ponds.`,
              icon: 'CheckCircle',
            });
          }

          alerts.push({
            type: 'Rainfall Alert',
            severity: 'high',
            message: '🌧️ Heavy rain expected in 5 days. Delay irrigation.',
            icon: 'CloudRain',
          });

          res.end(JSON.stringify({ alerts }));
          return;
        }

        if (pathname === '/api/location/search') {
          const q = parsedUrl.searchParams.get('q') || '';
          fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=1&q=${encodeURIComponent(q)}`, {
            headers: { 'User-Agent': 'BhumiJal-App/1.0' },
          })
            .then((r) => r.json())
            .then((data) => {
              if (Array.isArray(data) && data.length > 0) {
                res.end(JSON.stringify({
                  lat: parseFloat(data[0].lat),
                  lon: parseFloat(data[0].lon),
                  display_name: data[0].display_name,
                }));
              } else {
                res.end(JSON.stringify({ lat: 21.1458, lon: 79.0882, display_name: `${q} (India)` }));
              }
            })
            .catch(() => {
              res.end(JSON.stringify({ lat: 21.1458, lon: 79.0882, display_name: `${q} (India)` }));
            });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      apiDevServerPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'BhumiJal - Water Security Platform',
          short_name: 'BhumiJal',
          description: 'AI-powered water security platform for Indian farmers',
          theme_color: '#0d9488',
          background_color: '#042f2e',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'osm-tiles-cache',
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
