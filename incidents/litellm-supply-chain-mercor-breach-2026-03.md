---
id: litellm-supply-chain-mercor-breach-2026-03
date: 2026-03-24
title: Compromised LLM gateway packages harvest credentials, leading to a downstream customer breach
organization: LiteLLM and Mercor
scale: two malicious package versions live on PyPI for roughly 40 minutes; credentials harvested from systems that installed them; a downstream breach affecting a limited subset of one company's registered experts
surface: pipeline
tools:
  - package_install
harm:
  - credential_exposure
  - data_exfiltration
harm_bearer: both
reversible: false
root_cause:
  - malicious_tool_supply_chain
prevented_by_action_governance: 'no'
control: >
  No action-layer control applies, and the reason is uncomfortable rather than
  incidental. The malicious code ran at package install time, before any agent
  session existed and therefore before any runtime governance layer was
  loaded. A proxy that inspects tool calls sees nothing, because the theft was
  not a tool call. Helio ships as a package and sits in the same architectural
  position LiteLLM occupied: a widely installed dependency in the agent path,
  holding credentials, whose own compromise would not be visible to itself.
  The control this needs is build-provenance and install-time verification,
  which is a different layer.
sources:
  - url: https://docs.litellm.ai/blog/security-update-march-2026
    title: 'Security Update: Suspected Supply Chain Incident'
    publisher: LiteLLM
    date: 2026-03-24
    primary: true
  - url: https://www.mercor.com/blog/update-on-mercor-security-incident/
    title: 'Mercor Data Breach: Investigation Findings and Updates'
    publisher: Mercor
    date: 2026-06-25
    primary: true
  - url: https://techcrunch.com/2026/03/31/mercor-says-it-was-hit-by-cyberattack-tied-to-compromise-of-open-source-litellm-project/
    title: Mercor says it was hit by cyberattack tied to compromise of open source LiteLLM project
    publisher: TechCrunch
    date: 2026-03-31
    primary: false
aiid_incident: null
helio_pack: null
last_verified: 2026-08-10
---

On 24 March 2026 two malicious versions of LiteLLM, an open-source gateway
that routes calls to language model providers, were published to PyPI. They
were live from 10:39 UTC for approximately 40 minutes before being
quarantined. The packages carried a credential stealer that harvested
environment variables, SSH keys, cloud provider credentials, Kubernetes
tokens and database passwords, encrypting and sending them to a domain
unaffiliated with the project.

The publishing credentials were not stolen from LiteLLM directly. The
compromise reached the project's release pipeline through Trivy, a security
scanner used inside its own CI/CD workflow — a supply chain attack delivered
through a supply chain security tool. Installations that pinned their
dependencies, including the official proxy Docker image, were unaffected.
LiteLLM removed the packages, rotated maintainer credentials, engaged
forensic specialists, rebuilt its release pipeline and published a clean
version with signed images.

Mercor, a company that matches domain experts to AI labs for training work,
was breached in the same period through credentials attributable to the
LiteLLM compromise. An extortion group claimed on a leak site to hold several
terabytes of the company's data, and reporting in the days that followed
carried that claim alongside figures for the number of people affected.

Those early figures did not survive the investigation. In its own account
published on 25 June 2026, after the investigation closed, Mercor stated that
of its nearly five million experts "only a very limited subset had sensitive
information affected," that customer platforms were largely isolated from the
breach, that no employees were affected, and that there was "no evidence that
any of this data has been used fraudulently." Affected experts were notified
in late June and offered identity protection. The scale recorded here follows
the completed investigation rather than the initial leak-site claim.
