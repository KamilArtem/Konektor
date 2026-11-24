import {createImageUrlBuilder} from '@sanity/image-url'
import {SANITY_PROJECT_ID, SANITY_DATASET} from 'astro:env/server'

const builder = createImageUrlBuilder({projectId: SANITY_PROJECT_ID || 'not-configured', dataset: SANITY_DATASET})

type ImageSource = Parameters<typeof builder.image>[0]

/** Usage: urlFor(image).width(800).auto('format').url() */
export const urlFor = (source: ImageSource) => builder.image(source)
