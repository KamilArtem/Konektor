import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure, SINGLETON_TYPES} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'konektor',
  title: 'Konektor',
  projectId,
  dataset,
  plugins: [structureTool({structure}), visionTool({defaultApiVersion: '2025-11-01'})],
  schema: {
    types: schemaTypes,
    // Singletons cannot be created from the global "+" menu
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // Singletons cannot be duplicated or deleted
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
