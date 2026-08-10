import matter from 'gray-matter'
import YAML from 'yaml'

// gray-matter's default YAML engine (js-yaml, DEFAULT_SCHEMA) resolves
// unquoted ISO dates to JavaScript Date objects. That breaks both consumers:
// the schema declares `date` and `last_verified` as strings, and the built
// dataset would serialise them as full timestamps ("2026-04-25T00:00:00.000Z")
// rather than the ISO dates contributors actually wrote.
//
// The `yaml` package's core schema leaves them as strings, which is what we
// want. Contributors write plain unquoted dates and neither script has to
// care.
const engines = {
  yaml: {
    parse: (str) => YAML.parse(str),
    stringify: (obj) => YAML.stringify(obj),
  },
}

export function parseIncident(raw) {
  const parsed = matter(raw, { engines })
  return {
    data: parsed.data,
    body: parsed.content.replace(/^\uFEFF?/, '').trim(),
  }
}
