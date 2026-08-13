---
id: tanstack-npm-supply-chain-2026-05
date: 2026-05-11
title: Hijacked release pipeline publishes credential-stealing versions of 42 packages
organization: TanStack
scale: 84 malicious versions across 42 packages published in a six-minute window; all deprecated within 1 hour 43 minutes and removed from the registry within 4 hours 35 minutes
surface: pipeline
tools:
  - package_install
harm:
  - credential_exposure
  - data_exfiltration
  - malicious_code_distribution
harm_bearer: both
reversible: 'no'
root_cause:
  - malicious_tool_supply_chain
prevented_by_action_governance: partially
control: >
  Install-time governance addresses part of this. A policy that refuses
  unreviewed version bumps, or that pins and verifies what enters the
  dependency tree, would stop the malicious versions being pulled in during
  the window they were live. What no action-layer control sees is the theft
  itself: the payload ran at install time, harvesting credentials from disk
  and environment before any agent session existed. The half that is
  governable is entry into the tree, not what the code does once it is there.
sources:
  - url: https://tanstack.com/blog/npm-supply-chain-compromise-postmortem
    title: 'Postmortem: TanStack npm supply-chain compromise'
    publisher: TanStack
    date: 2026-05-11
    primary: true
  - url: https://github.com/advisories/GHSA-g7cv-rxg3-hmpx
    title: Malware in @tanstack/* packages exfiltrates cloud credentials, GitHub tokens, and SSH keys
    publisher: GitHub Advisory Database
    date: 2026-05-11
    primary: false
aiid_incident: null
helio_pack: null
last_verified: 2026-08-10
---

On 11 May 2026, between 19:20 and 19:26 UTC, an attacker published 84
malicious versions across 42 `@tanstack/*` packages to the npm registry. The
packages carried a roughly 2.3 MB obfuscated payload that ran on install,
harvesting credentials from AWS, GCP, Kubernetes, Vault, GitHub, npm and SSH
locations, exfiltrating them over an encrypted messenger network, and
republishing other packages the victim maintained in order to spread further.

No single flaw was sufficient. The attacker chained three. A workflow used the
`pull_request_target` trigger for pull requests from forks, which grants a
fork's code access to the base repository's context. That access was used to
poison the GitHub Actions cache, which crosses the fork and base trust
boundary — in the project's own words, "cache writes use a runner-internal
token, not the workflow GITHUB_TOKEN," so restricting workflow permissions
does not prevent cache mutation. A subsequent legitimate build consumed the
poisoned cache, and the malware then located the Actions runner process and
extracted an OIDC token from its memory. That token was used to publish
directly to npm, bypassing the project's normal release path entirely.

The result was malicious packages carrying valid provenance. Because they were
published from inside the legitimate runner using a legitimate token, the
supply chain attestations that exist to prove authenticity attested to them
correctly.

The compromise was detected by an external researcher about twenty minutes
after the first batch went out. Deprecations began within an hour and all 84
versions were deprecated within one hour and forty-three minutes. The affected
packages were confined to one monorepo; the project's other libraries were
untouched. The maintainers restructured the offending workflow, added
repository-owner guards, pinned third-party actions to specific commits and
purged cache entries across their repositories. The same threat group
compromised more than 170 packages across npm and PyPI over the same period.
