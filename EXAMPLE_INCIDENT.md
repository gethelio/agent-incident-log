---
# yaml-language-server: $schema=../schema/incident.schema.json
# Copy this file to incidents/<your-slug>.md
# Delete every comment (lines starting with #) before submitting.
# The id MUST match the filename without .md

id: example-incident-slug-2026-01
# ISO date the incident occurred (or the best public date)
date: 2026-01-15
title: Short factual title of what happened
# Organization name, or the literal string: not disclosed
organization: Example Corp
# Free-text scale of impact
scale: production database deleted for one tenant
# One of: coding_agent | browser_agent | chat_agent | pipeline | infrastructure
surface: coding_agent
agent_stack:
  # Optional. Omit the whole block, or either field, if sources do not say.
  framework: ExampleAgent
  model: Example Model
# One or more of: database | repo | payments | comms | filesystem | browser |
# package_install | saas_app
# May be empty ([]) only when surface is infrastructure, where no agent invokes
# anything. Do not reach for a loose fit just to put something here.
tools:
  - database
# One or more controlled harm values (see schema/incident.schema.json)
harm:
  - data_destruction
# One of: first_party | third_party | both | unclear
harm_bearer: first_party
# One of: yes | no | unclear. Quote yes and no — some YAML parsers read them as
# booleans. Use unclear when no source settles it; do not default to no, which
# claims the harm was permanent.
reversible: 'no'
# One or more controlled root_cause values (see schema)
root_cause:
  - missing_approval_gate
# One of: likely | partially | no | unclear
# Be honest. A meaningful share of entries must be no or unclear.
prevented_by_action_governance: likely
# Required when prevented_by_action_governance is likely or partially.
# Describe the control that would have helped, or why a shipped control matches.
control: >
  An approval gate on destructive database tools would have held the call
  until a human confirmed.
sources:
  # Minimum two. At least one primary: true where a primary source exists.
  # publisher is the platform, not the author, when someone writes under their
  # own name — X, Substack, Medium. Editorial rule 2 keeps individuals out of
  # entries, and a byline in this field would put them back.
  - url: https://example.com/primary-account
    title: Founder's public account of the incident
    publisher: Example Blog
    date: 2026-01-16
    primary: true
    # Optional Wayback (or similar) archive
    archive_url: https://web.archive.org/web/20260116000000/https://example.com/primary-account
  - url: https://example.com/news-coverage
    title: News coverage of the incident
    publisher: Example News
    date: 2026-01-17
    primary: false
# AI Incident Database number if indexed there, otherwise null
aiid_incident: null
# URL to a Helio control pack if one applies, otherwise null
helio_pack: null
# Set to today's date when you submit or re-verify
last_verified: 2026-01-17
---

Write the prose account in original words. What happened, in what order, and
what the failure actually was. Do not paraphrase source coverage into a
summary of someone else's article. A short attributed quote is allowed only
when the exact wording is materially load-bearing.