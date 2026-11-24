import {createClient} from '@sanity/client'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_WRITE_TOKEN
const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId || !token) {
  console.error('BŁĄD: Wymagane zmienne środowiskowe:')
  console.error('  SANITY_PROJECT_ID=...')
  console.error('  SANITY_AUTH_TOKEN=... (z uprawnieniem Write w panelu Sanity)')
  console.error('\nPrzykład uruchomienia:')
  console.error('  SANITY_PROJECT_ID=xyz SANITY_AUTH_TOKEN=sk... node studio/seed.js')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-11-01',
  token,
  useCdn: false,
})

async function run() {
  const filePath = path.join(__dirname, 'seed-data.json')
  const docs = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  console.log(`Importowanie ${docs.length} dokumentów do Sanity (projekt: ${projectId}, dataset: ${dataset})...`)

  const transaction = client.transaction()
  for (const doc of docs) {
    transaction.createOrReplace(doc)
  }

  const result = await transaction.commit()
  console.log(`Sukces! Zaktualizowano / zaimportowano dokumenty. ID transakcji: ${result.transactionId}`)
}

run().catch((err) => {
  console.error('Wystąpił błąd podczas importu:', err)
  process.exit(1)
})
