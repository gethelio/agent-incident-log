# Editorial policy

These rules govern every entry in the Agent Incident Log. They are enforced by maintainer review, not by CI.

1. **Two independent sources minimum**, primary where possible.
2. **No naming individual engineers.** Organizations only. If a person spoke publicly under their own name, attribute the entry to the organization, do not name the individual, and let the linked source do the naming.
3. **Factual and systemic tone.** No dunking, including on competitors.
4. **Right of reply.** Any named organization can request a correction via a [correction issue](https://github.com/gethelio/agent-incident-log/issues/new?template=correction.yml). Corrections are logged in the entry rather than silently applied.
5. **No entry ends in a call to action.** The `helio_pack` field is a link when a relevant control pack exists; it is not a pitch. Leave it `null` when nothing fits.
6. **Original prose.** No quoting from source coverage beyond a short attributed phrase where exact wording is materially load-bearing. The log is CC BY licensed and will be reused, so entries must not be paraphrase-shaped containers for other people's article text.
7. **Incidents, not disclosures.** An entry requires either realized harm, or a real adversary completing a real exploitation of a production system. Researcher demonstrations, responsible disclosures and sandboxed exercises are out of scope however severe the underlying flaw and however widely it was reported. An unidentified harmed party does not disqualify an entry, because attribution is frequently impossible — an absent one does. Where a compromise completed but its payload did not, the entry records what happened rather than what was intended.
