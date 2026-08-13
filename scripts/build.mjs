import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseIncident } from './frontmatter.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const incidentsDir = path.join(root, 'incidents')
const distDir = path.join(root, 'dist')
const outPath = path.join(distDir, 'incidents.json')

const files = (await readdir(incidentsDir))
  .filter((name) => name.endsWith('.md'))
  .sort()

const incidents = []
for (const name of files) {
  const raw = await readFile(path.join(incidentsDir, name), 'utf8')
  const parsed = parseIncident(raw)
  incidents.push({
    ...parsed.data,
    body: parsed.body,
  })
}

const payload = {
  // 2: `reversible` became a yes/no/unclear string, having been a boolean, and
  // `tools` may now be empty on an infrastructure entry. Both break a consumer
  // that assumed the old shapes, which is what this number is for.
  version: 2,
  license: 'CC-BY-4.0',
  attribution: 'Helio Agent Incident Log, https://helio.so/incidents',
  generated_at: new Date().toISOString(),
  count: incidents.length,
  incidents,
}

await mkdir(distDir, { recursive: true })
await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
console.log(`Wrote ${outPath} (${incidents.length} incident(s))`)
