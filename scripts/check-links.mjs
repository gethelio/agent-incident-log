import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { parseIncident } from './frontmatter.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const incidentsDir = path.join(root, 'incidents')

const files = (await readdir(incidentsDir))
  .filter((name) => name.endsWith('.md'))
  .sort()

let failures = 0

for (const name of files) {
  const file = path.join('incidents', name)
  const { data } = parseIncident(await readFile(path.join(incidentsDir, name), 'utf8'))
  const sources = Array.isArray(data.sources) ? data.sources : []
  for (const [i, source] of sources.entries()) {
    const url = source?.url
    if (typeof url !== 'string') continue
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'user-agent': 'gethelio-agent-incident-log-link-check/1.0' },
      })
      if (res.status >= 400) {
        console.error(`${file}: sources[${i}].url: HTTP ${res.status} for ${url}`)
        failures += 1
      } else {
        console.log(`OK ${res.status} ${url}`)
      }
    } catch (err) {
      console.error(
        `${file}: sources[${i}].url: ${err instanceof Error ? err.message : String(err)} for ${url}`,
      )
      failures += 1
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} dead or unreachable link(s)`)
  process.exit(1)
}

console.log('OK: all source URLs reachable')
