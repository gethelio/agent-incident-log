---
id: flowise-custom-mcp-rce-2026-04
date: 2026-04-07
title: Agent builder exploited in the wild through unsafe evaluation of MCP server configuration
organization: Flowise
scale: more than 12,000 internet-facing instances exposed; exploitation observed in the wild; no specific compromise publicly confirmed
surface: infrastructure
tools: []
harm:
  - unauthorized_system_access
harm_bearer: first_party
reversible: 'no'
root_cause:
  - unsafe_code_execution
prevented_by_action_governance: 'no'
control: >
  No action-layer control applies. The vulnerability is reached over an HTTP
  endpoint on the agent builder itself, and the attacker is not an agent and
  makes no tool calls. A governance proxy sits between an agent and the tools
  it invokes; here there is no agent in the path at all. Nothing about this is
  visible from that position, and the control it needs is ordinary application
  security — not evaluating attacker-controlled strings as code.
sources:
  - url: https://github.com/advisories/GHSA-3gcm-f6qx-ff7p
    title: Flowise has Remote Code Execution vulnerability
    publisher: GitHub Advisory Database
    date: 2025-09-13
    primary: true
  - url: https://thehackernews.com/2026/04/flowise-ai-agent-builder-under-active.html
    title: Flowise AI Agent Builder Under Active CVSS 10.0 RCE Exploitation
    publisher: The Hacker News
    date: 2026-04-07
    primary: false
aiid_incident: null
helio_pack: null
last_verified: 2026-08-10
---

Flowise is a visual builder for LLM applications and agents. Its CustomMCP
node accepts a configuration string describing an external MCP server to
connect to. While converting that string into usable configuration, the code
passed it directly to JavaScript's `Function()` constructor, which evaluates
its argument as code. Anything supplied through the relevant API endpoint ran
on the server with full Node.js privileges, including access to process and
filesystem modules.

The flaw was assigned CVE-2025-59528, scored 10.0, and disclosed in September
2025, with a fix in version 3.0.6. Exploitation in the wild was reported in
April 2026, more than six months later, with scanning and exploitation
attempts traced to a single source and more than 12,000 internet-facing
instances exposed at the time. No specific compromise or named victim has been
publicly confirmed; what is documented is a real adversary actively
exploiting a real vulnerability in production deployments, not a
demonstration.

This entry is included because that exploitation is real, and it is recorded
as `no` because nothing in the action layer touches it. It is worth stating
plainly what the failure was: an agent framework executed attacker-supplied
text as code. That is a conventional software defect of a kind that predates
agents entirely, and no amount of governing what an agent is permitted to do
addresses it. Deployments that were patched, or that were not exposed to the
internet, were not affected.
