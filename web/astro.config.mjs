// @ts-check
import {defineConfig, envField} from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://www.konektor.com.pl',
  trailingSlash: 'never',

  // Pages are prerendered (static) by default. Only Astro Actions
  // (contact form) and pages with `export const prerender = false` run on the Worker.
  output: 'static',
  adapter: cloudflare({
    // Images come from the Sanity CDN (already resized/optimised), so no Worker-side transforms.
    imageService: 'passthrough',
  }),

  integrations: [sitemap()],

  i18n: {
    defaultLocale: 'pl',
    locales: ['pl'],
  },

  env: {
    schema: {
      // Public – inlined at build time
      SANITY_PROJECT_ID: envField.string({context: 'server', access: 'public', optional: true}),
      SANITY_DATASET: envField.string({context: 'server', access: 'public', default: 'production'}),
      SANITY_API_VERSION: envField.string({context: 'server', access: 'public', default: '2025-11-01'}),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({context: 'client', access: 'public', optional: true}),

      // Contact form (server, runtime)
      CONTACT_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'public',
        default: 'Konektor – formularz <formularz@konektor.com.pl>',
      }),
      CONTACT_TO_EMAIL: envField.string({context: 'server', access: 'public', default: 'bok@konektor.com.pl'}),

      // Secrets – read at runtime from Worker secrets (`wrangler secret put …`) / .dev.vars locally
      RESEND_API_KEY: envField.string({context: 'server', access: 'secret', optional: true}),
      TURNSTILE_SECRET_KEY: envField.string({context: 'server', access: 'secret', optional: true}),
      SANITY_API_READ_TOKEN: envField.string({context: 'server', access: 'secret', optional: true}),
    },
  },
})
