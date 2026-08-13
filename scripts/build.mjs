import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseIncident } from './frontmatter.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const incidentsDir = path.join(root, 'incidents')
const distDir = path.join(root, 'dist')
const outPath = path.join(distDir, 'incidents.json')
const readmePath = path.join(root, 'README.md')

// Order the counter reads in, matching the site's KNOWN_PREVENTION_VERDICTS.
// Every one is printed even at zero: a category that disappears when empty
// makes the vocabulary look chosen after the results were in, and the reason
// this breakdown is published at all is that it was not.
const VERDICT_ORDER = ['likely', 'partially', 'no', 'unclear']

const START = '<!-- distribution:start -->'
const END = '<!-- distribution:end -->'

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

/**
 * The same sentence the site renders, from the same numbers.
 *
 * Hand-maintaining this meant the repo's front page could advertise a
 * distribution its own dataset contradicted, which is a bad failure for a log
 * whose pitch is that it checks things.
 */
function distributionSentence(entries) {
  const counts = new Map(VERDICT_ORDER.map((verdict) => [verdict, 0]))
  for (const incident of entries) {
    const verdict = incident.prevented_by_action_governance
    counts.set(verdict, (counts.get(verdict) ?? 0) + 1)
  }

  // Anything the vocabulary gains later still appears, after the known values
  // rather than dropped, matching getDistribution() on the site.
  const ordered = [
    ...VERDICT_ORDER,
    ...[...counts.keys()].filter((v) => !VERDICT_ORDER.includes(v)).sort(),
  ]

  const parts = ordered.map((verdict, index) => {
    const label = verdict.replace(/_/g, ' ')
    const count = counts.get(verdict) ?? 0
    return index === 0
      ? `${label} have prevented ${count}`
      : `${label} ${count}`
  })

  const noun = entries.length === 1 ? 'entry' : 'entries'
  return `Of ${entries.length} ${noun}, action governance would ${parts.join(', ')}.`
}

const readme = await readFile(readmePath, 'utf8')
const startAt = readme.indexOf(START)
const endAt = readme.indexOf(END)

// Fail rather than skip. A missing marker means the counter silently stops
// tracking the data, which is the exact failure this replaced.
if (startAt === -1 || endAt === -1 || endAt < startAt) {
  console.error(
    `README.md is missing the ${START} / ${END} markers around the ` +
      'distribution sentence, so it cannot be regenerated.',
  )
  process.exit(1)
}

const rebuilt =
  readme.slice(0, startAt + START.length) +
  `\n${distributionSentence(incidents)}\n` +
  readme.slice(endAt)

if (rebuilt === readme) {
  console.log('README distribution unchanged')
} else {
  await writeFile(readmePath, rebuilt, 'utf8')
  console.log(`Updated ${readmePath} distribution counter`)
}
