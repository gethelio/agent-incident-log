# agent-incident-log

A public reference log of real incidents involving AI agents and the tools they
call. Public repo, CC BY 4.0, and the data source behind
**helio.so/incidents** — every merge to `main` reaches the live site within
seconds.

Contributor-facing rules live in [CONTRIBUTING.md](CONTRIBUTING.md) and
[EDITORIAL_POLICY.md](EDITORIAL_POLICY.md). This file is the operational layer:
how the pipeline works and what has already gone wrong.

## Commands

All three run from `scripts/` and need `npm ci` there first. Node 20+, CI uses 22.

```bash
cd scripts && npm ci
npm run validate     # schema + mechanical constraints over incidents/*.md
npm run build        # writes dist/incidents.json AND the README counter
npm run check-links  # GETs every sources[].url, fails on >= 400
```

`build` has a side effect beyond `dist/`: it rewrites the distribution
sentence in `README.md` between its markers. That is not incidental, see below.

## The pipeline

```
merge to main ──> publish.yml ──> validate ──> build ──> commit dist + README
                                                     └─> POST INCIDENT_REVALIDATE_URL
                                                            └─> helio.so purges its cache tag
```

`publish.yml` is path-filtered to `incidents/**`, `schema/**`, `scripts/**`.
Changes to `.github/` or `README.md` alone do **not** publish, which is also why
the bot's own commit does not retrigger it. Use `workflow_dispatch` to force a
rebuild.

The site validates the payload *before* purging and keeps serving the old data
if it fails. A bad dataset therefore shows up as a failed notify step, not as a
broken site.

### The notify secret can only be rotated, never read

`INCIDENT_REVALIDATE_URL` holds helio.so's cache-purge endpoint with its shared
secret in the query string. **It is not a Vercel deploy hook** — it was called
`VERCEL_DEPLOY_HOOK_URL` until August 2026, which named an approach that does
not work at all: Next's Data Cache survives deployments and Vercel restores
`.next/cache` between builds, so a merge-triggered rebuild re-serves the payload
cached *before* the merge and deploys green without the new entry. Do not
recreate a deploy hook.

The value is unreadable from both ends — write-only as a GitHub secret,
`Encrypted` in Vercel — so changing it means generating a new one, setting it in
Vercel for Preview and Production, **redeploying**, then updating this repo's
secret. Skipping the redeploy is the silent failure: an env change does not
reach a deployment that already baked the old value, so the endpoint keeps
accepting the previous secret and nothing appears to have happened.

## Traps

Each of these cost real time, and each looks like a different problem than it is.

- **A conflicting PR gets zero CI checks, not a failing one.** GitHub builds
  `pull_request` runs against the merge ref and cannot compute one when the
  merge conflicts, so no workflow runs at all. It reads exactly like a broken
  trigger. The tell is `mergeable: CONFLICTING` with no checks. This happens
  constantly here because every publish produces a bot commit, so any branch cut
  before it lands conflicts on `dist/incidents.json`.
- **Resolve `dist/incidents.json` conflicts by regenerating, never by hand.**
  Rebase onto `main`, run `npm run build`, `git add`, continue. It is generated
  output and `generated_at` changes on every build, so a hand-merge is both
  pointless and error-prone.
- **After a publish, the site serves stale on the first request to each page.**
  That is stale-while-revalidate working correctly: the first request returns
  the old copy and triggers regeneration. `/incidents.json` converges before the
  entry pages. Poll twice before concluding a publish failed.
- **`check-links` 403s are usually not dead links.** Publisher bot protection
  rejects GitHub runner IPs while the same URL returns 200 from a laptop. Read
  the issue it opens before editing any entry. `openai.com` 403s every
  non-browser request, which is why OpenAI's own disclosure is not cited in the
  sandbox-escape entry even though it exists.
- **Quote `yes` and `no` in front matter.** The pinned parser is YAML 1.2 where
  they are strings, but js-yaml's default schema is 1.1 where they are booleans,
  and a contributor's editor is not the parser we pinned. `scripts/frontmatter.mjs`
  exists because of exactly this class of bug: gray-matter's default engine
  resolved unquoted ISO dates to `Date` objects, which made `validate` reject
  every valid entry and `build` write corrupt timestamps into the public dataset.
- **ajv runs in strict mode.** A type-specific keyword inside an `allOf` branch
  needs its `type` restated, or the schema fails to compile — `minItems` alone
  in a `then` block throws `strictTypes`.

## Two things are generated and one has a twin

`README.md`'s distribution sentence is written by `build.mjs` between
`<!-- distribution:start -->` / `<!-- distribution:end -->`. Missing markers
exit 1 rather than skipping, because silently freezing the counter is the exact
failure that automating it removed. It was hand-maintained until August 2026 and
went stale three times in four days.

**That sentence has a twin.** `components/incidents/distribution-counter.tsx` in
`gethelio/helio-website` renders the same wording from the same figures — two
implementations, two languages, two repos, no shared code path, nothing
enforcing agreement and no test on either side. Change the wording or the
verdict ordering in `distributionSentence`/`VERDICT_ORDER` here and you must
change it there in the same breath.

## Branch protection is deliberately off

It was applied and removed. `publish.yml` commits regenerated files directly to
`main` as `github-actions[bot]`, and any meaningful protection blocks that push:

```
GH006: Protected branch update failed for refs/heads/main.
- Changes must be made through a pull request.
- Required status check "validate" is expected.
```

It fails on **both** grounds, so dropping only the review requirement does not
help — the bot's commit never receives a `validate` run, so a required status
check blocks it permanently. A bypass actor for the Actions app is not available
at repo level: classic protection silently discards
`bypass_pull_request_allowances.apps`, and repo-level rulesets reject the actor
outright.

If protection is ever wanted, there are exactly two routes: an org-level ruleset
with the GitHub Actions app as a bypass actor (needs `admin:org`), or stop the
bot pushing to `main` by publishing `dist` to a separate branch or release asset
and repointing the site — which changes the published data contract.

**Do not re-add branch protection without reading the above.** It will break
publishing, and the failure is immediate.

## Schema notes that are not obvious from the schema

- `reversible` is `yes` / `no` / `unclear`, quoted. Reach for `unclear` when no
  source settles it. Defaulting to `no` asserts the harm was permanent, which is
  a claim, not an absence of one. It was a boolean until August 2026.
- `tools` may be empty (`[]`) **only** when `surface` is `infrastructure`, where
  no agent invokes anything. The conditional is enforced in the schema. Do not
  stretch for a loose value to fill it.
- `publisher` is the platform, not the author, for personally authored sources
  (`X`, `Substack`). A byline reintroduces the individuals editorial rule 2
  keeps out.
- `aiid_incident: null` currently means *nobody checked*, not *no record
  exists*. Only one entry carries a real value. Treat the nulls as unfinished
  work rather than as findings.
- The dataset is `version: 2`. Bump it for any change that breaks a consumer
  assuming the old shapes, and widen the site's loader **first** — it throws on
  an unusable payload by design, so shipping the data first means the site
  rejects it and serves stale until it catches up.

## Editorial

Seven rules in [EDITORIAL_POLICY.md](EDITORIAL_POLICY.md), enforced by review
rather than CI. Rule 7 is the one that decides borderline candidates: an entry
needs realized harm, or a real adversary completing a real exploitation of a
production system. Researcher demonstrations and responsible disclosures are out
however severe the flaw. An unidentified victim does not disqualify an entry; an
absent one does.

Four candidates have failed verification on that rule, all of them reported as
incidents by someone. Verification is most of the work in adding an entry, and
several entries correct figures that mainstream coverage got wrong — check
primary sources rather than the coverage, and record which account an entry
follows when they disagree.
