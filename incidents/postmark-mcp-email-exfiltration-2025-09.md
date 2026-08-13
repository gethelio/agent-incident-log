---
id: postmark-mcp-email-exfiltration-2025-09
date: 2025-09-17
title: Trojanised MCP server on npm blind-copies every email an agent sends to its publisher
organization: not disclosed
scale: sixteen versions published to npm over ten days, with a blind-copy line added on the third day and live for the following week; 1,643 total downloads and roughly 1,500 a week at the time of discovery; no affected organization has been publicly identified
surface: infrastructure
tools:
  - comms
harm:
  - data_exfiltration
harm_bearer: both
reversible: 'no'
root_cause:
  - malicious_tool_supply_chain
  - no_install_governance
prevented_by_action_governance: partially
control: >
  Inspecting the agent's calls does not catch this. The agent asks the server
  to send a legitimate message to a legitimate recipient, and that is exactly
  what the call contains; the extra recipient is added inside the server
  afterwards, when it builds its own request to the email provider, which is
  past the point a proxy between agent and server can see. What action
  governance does reach is which servers an agent may reach at all. An
  allowlist pinned to the vendor's own published server, by identity and by
  version, refuses an unaffiliated package asserting the vendor's name, and
  refuses the version bump that introduced the line. That is a real control
  and it would have held here, which is why this is not recorded as `no` — but
  it works by keeping the server out of the path, not by seeing what the
  server does once it is in it. Anything an approved server does with a
  well-formed call remains invisible from that position and needs egress
  control on the server itself, which is a different layer.
sources:
  - url: https://www.koi.ai/blog/postmark-mcp-npm-malicious-backdoor-email-theft
    title: 'First Malicious MCP in the Wild: The Postmark Backdoor That''s Stealing Your Emails'
    publisher: Koi Security
    date: 2025-09-25
    primary: true
  - url: https://postmarkapp.com/blog/information-regarding-malicious-postmark-mcp-package
    title: "Security Alert: Malicious 'postmark-mcp' npm Package Impersonating Postmark"
    publisher: Postmark
    date: 2025-09-25
    primary: true
  - url: https://registry.npmjs.org/postmark-mcp
    title: postmark-mcp registry metadata
    publisher: npm
    date: 2025-09-25
    primary: true
  - url: https://thehackernews.com/2025/09/first-malicious-mcp-server-found.html
    title: First Malicious MCP Server Found Stealing Emails in Rogue Postmark-MCP Package
    publisher: The Hacker News
    date: 2025-09-29
    primary: false
aiid_incident: null
helio_pack: null
last_verified: 2026-08-11
---

A package called `postmark-mcp` was published to npm in September 2025. It was
a copy of the MCP server that the email provider Postmark maintains for its own
service, carrying the same name and presenting itself as the same tool, but
published by someone unaffiliated with the company. Agents configured with it
gained an apparently ordinary ability to send email. From the sixteenth
release, every message sent through it was also blind-copied to an address
controlled by the package's publisher — one line, added to code that otherwise
behaved exactly as the legitimate project did.

The npm registry's own metadata, which survived the package's removal, dates
the sequence more precisely than the coverage of it does. Sixteen versions were
published in total. The first went up on 15 September 2025 and the last clean
one about twenty-six hours later; the release carrying the blind-copy line
followed on the morning of 17 September, and two further versions went out
within half an hour of it. The package was unpublished on 25 September, so the
backdoored code was installable for roughly eight days. Published accounts
describe this as trust built over fifteen releases before a betrayal, which
reads as a long confidence trick; the registry shows the clean history was
about a day long and the impersonation was the point from the start.

What was exposed follows from what the tool was for. Mail sent programmatically
through a provider like this is transactional — password resets, invoices,
confirmations, internal notifications — so the blind copies carried both the
installing organization's own correspondence and material belonging to the
people it was writing to, including tokens that grant account access. The
research that found the package estimated around three hundred active
installations and somewhere between three and fifteen thousand messages a day
on that basis. Those are estimates and are presented as such; the download
count of 1,643 is the only hard figure, and no affected organization has been
publicly identified.

Postmark's own service was not involved. The company's API and infrastructure
were unaffected, and its position was that the legitimate package remained
secure — the incident is an impersonation of its name, not a compromise of it.
When the researchers contacted the publisher they received no reply; the
package was then unpublished without explanation. `organization` is recorded as
not disclosed because the parties that bore the harm were never named, and
naming the impersonated vendor in that field would attribute the incident to
the one organization here that did nothing wrong.
