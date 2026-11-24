import {createClient, type QueryParams} from '@sanity/client'
import {SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION} from 'astro:env/server'

export const isSanityConfigured = Boolean(SANITY_PROJECT_ID)

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID || 'not-configured',
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  // Pages are prerendered at build → always read fresh, published content.
  useCdn: false,
  perspective: 'published',
})

/**
 * Typed GROQ fetch. Returns `fallback` when Sanity isn't configured yet,
 * so the project builds before the Sanity project exists.
 */
export async function sanityFetch<T>(query: string, params: QueryParams = {}, fallback: T): Promise<T> {
  if (!isSanityConfigured) {
    console.warn('[sanity] SANITY_PROJECT_ID not set – returning fallback data')
    return fallback
  }
  return (await sanityClient.fetch<T>(query, params)) ?? fallback
}
