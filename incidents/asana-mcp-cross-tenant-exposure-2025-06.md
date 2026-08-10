---
id: asana-mcp-cross-tenant-exposure-2025-06
date: 2025-06-04
title: Work management MCP server returns one organization's data to another
organization: Asana
scale: approximately 1,000 customer organizations notified; cross-tenant exposure possible for roughly five weeks
surface: infrastructure
tools:
  - saas_app
harm:
  - data_exposure
harm_bearer: third_party
reversible: false
root_cause:
  - tenant_isolation_failure
prevented_by_action_governance: 'no'
control: >
  No action-layer control applies. The agent issued a legitimate, authorized
  request for data its own principal was entitled to, and the server answered
  with someone else's records. Nothing about the call is anomalous at the
  point where a governance proxy would inspect it: the caller, the tool and
  the arguments are all exactly what they should be. The defect is in the
  server's authorization logic, and only the server can see it.
sources:
  - url: https://www.bleepingcomputer.com/news/security/asana-warns-mcp-ai-feature-exposed-customer-data-to-other-orgs/
    title: Asana warns MCP AI feature exposed customer data to other orgs
    publisher: BleepingComputer
    date: 2025-06-18
    primary: false
  - url: https://www.sans.org/newsletters/newsbites/xxvii-47
    title: Experimental MCP Server Exposed Asana Data
    publisher: SANS Institute
    date: 2025-06-24
    primary: false
aiid_incident: null
helio_pack: null
last_verified: 2026-08-10
---

Asana launched an opt-in MCP server on 1 May 2025, allowing customers to
connect AI assistants to their work management data. A flaw in how the server
enforced access control meant that a request scoped to one customer could
return records belonging to another. Asana identified the bug on 4 June 2025,
took the feature offline the following day, and restored it on 17 June 2025.
Roughly 1,000 customer organizations were notified.

The exposure was a logic error rather than an intrusion. No attacker was
involved and no credential was misused. Depending on how a given customer had
configured the integration and how much their users had queried it, the
records reachable across the tenant boundary could include task-level
information, project metadata, team details, comments and uploaded files.

Two details are worth preserving precisely. Asana's notices to affected
customers describe what could have been exposed rather than confirming what
was, and both contemporaneous reporting and the company's own advice to
administrators — review MCP access logs, review AI-generated summaries, report
anything that appears to belong to another organization — reflect that
uncertainty. Asana also issued no public statement, communicating only with
the organizations it had identified as affected, so the public record here
rests on reporting of those notices rather than on a first-party account.
