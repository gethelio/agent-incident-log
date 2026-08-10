import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { parseIncident } from './frontmatter.mjs'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const incidentsDir = path.join(root, 'incidents')
const schemaPath = path.join(root, 'schema', 'incident.schema.json')

const schema = JSON.parse(await readFile(schemaPath, 'utf8'))
const ajv = new Ajv2020({ allErrors: true, strict: true })
addFormats(ajv)
const validate = ajv.compile(schema)

function todayUtcDate() {
  return new Date().toISOString().slice(0, 10)
}

function fail(file, field, message) {
  console.error(`${file}: ${field}: ${message}`)
}

const files = (await readdir(incidentsDir))
  .filter((name) => name.endsWith('.md'))
  .sort()

let errors = 0
const seenIds = new Map()
const today = todayUtcDate()

for (const name of files) {
  const file = path.join('incidents', name)
  const raw = await readFile(path.join(incidentsDir, name), 'utf8')
  let data
  try {
    data = parseIncident(raw).data
  } catch (err) {
    fail(file, 'front_matter', err instanceof Error ? err.message : String(err))
    errors += 1
    continue
  }

  if (!validate(data)) {
    for (const err of validate.errors ?? []) {
      const field = err.instancePath || err.schemaPath
      fail(file, field, err.message ?? 'schema validation failed')
      errors += 1
    }
  }

  const id = data?.id
  const expectedId = name.replace(/\.md$/, '')
  if (id !== expectedId) {
    fail(file, 'id', `must match filename (expected "${expectedId}", got ${JSON.stringify(id)})`)
    errors += 1
  }

  if (typeof id === 'string') {
    if (seenIds.has(id)) {
      fail(file, 'id', `duplicate of ${seenIds.get(id)}`)
      errors += 1
    } else {
      seenIds.set(id, file)
    }
  }

  if (typeof data?.date === 'string' && data.date > today) {
    fail(file, 'date', `must not be in the future (got ${data.date}, today ${today})`)
    errors += 1
  }

  if (
    typeof data?.date === 'string' &&
    typeof data?.last_verified === 'string' &&
    data.last_verified < data.date
  ) {
    fail(
      file,
      'last_verified',
      `must not be earlier than date (date ${data.date}, last_verified ${data.last_verified})`,
    )
    errors += 1
  }
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s)`)
  process.exit(1)
}

console.log(`OK: ${files.length} incident(s) validated`)
