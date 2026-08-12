---
id: amazon-q-developer-extension-compromise-2025-07
date: 2025-07-17
title: Injected instructions ship inside an AI coding extension telling the agent to wipe local files and cloud resources
organization: Amazon Web Services
scale: one release of a Visual Studio Code extension published to the marketplace and installable for roughly a week before withdrawal; the vendor states the injected instructions did not execute and that no service or customer environment was changed
surface: coding_agent
agent_stack:
  framework: Amazon Q Developer
tools:
  - filesystem
harm:
  - malicious_code_distribution
harm_bearer: both
reversible: true
root_cause:
  - malicious_tool_supply_chain
  - overscoped_credential
prevented_by_action_governance: partially
control: >
  This one divides cleanly in two, and the halves get different answers. The
  compromise of the release pipeline is outside the action layer entirely: an
  overscoped token let an outside contributor reach a production build, and no
  amount of governing what an agent may do prevents a malicious version being
  published. But the payload is not a credential stealer running at install
  time, and that is the distinction from the other supply chain entries here.
  It is a set of instructions that only does anything by persuading the agent
  to act — to delete files and to issue destructive cloud operations through
  the same tool path any other request would take. Those calls are exactly
  what an action layer inspects, and an approval gate on destructive
  filesystem and infrastructure operations would have held them whatever the
  agent believed it had been told. Recorded as `partially` because governance
  at the action layer blunts the payload without preventing its delivery.
sources:
  - url: https://github.com/aws/aws-toolkit-vscode/security/advisories/GHSA-7g7f-ff96-5gcw
    title: Malicious script injected into Amazon Q Developer for Visual Studio Code Extension
    publisher: GitHub Advisory Database
    date: 2025-07-26
    primary: true
  - url: https://www.techrepublic.com/article/news-amazon-q-data-wiping-prompt-security-hack/
    title: Hacker Exposes Amazon Q Security Flaws Using Covert Code
    publisher: TechRepublic
    date: 2025-07-28
    primary: false
aiid_incident: null
helio_pack: null
last_verified: 2026-08-12
---

In July 2025 an outside contributor opened a pull request against the public
repository behind Amazon Q Developer, an AI coding assistant distributed as a
Visual Studio Code extension. The access that followed was not earned by
defeating a control; a GitHub token in the project's build configuration was
scoped more broadly than the task required, and it was enough to commit to the
codebase that fed a production release. The commit added instructions
addressed to the agent itself, directing it to clear the system to a
near-factory state and to delete both local files and cloud resources through
the provider's command line tools.

Version 1.84.0 carrying those instructions was published to the marketplace on
17 July 2025 and was installable from it. Security researchers reported the
problem on 23 July, a clean 1.85.0 followed on 24 July, and the compromised
version was pulled from distribution. The advisory was published on 26 July as
CVE-2025-8217, scored 4.0 and recorded as affecting integrity only.

What did not happen matters as much as what did. AWS inspected the code and
states that it "was distributed with the extension but was unsuccessful in
executing due to a syntax error", and that this "prevented the malicious code
from making changes to any services or customer environments". No destruction
of any customer's files or infrastructure has been reported by anyone. Some
security commentators have disputed the mechanism, arguing that the code did
run and simply did nothing, and the person claiming responsibility described
the payload as deliberately defective and intended as a statement about AI
coding security rather than as a working weapon. Those accounts differ on why
nothing happened, not on whether it did, and this entry follows the vendor's
technical account while recording that the point is contested.

The entry is included because the compromise itself was real and completed. An
unauthorised party reached a production release pipeline and shipped code to
the users of a widely installed extension, which is a different thing from a
researcher demonstrating that they could. The harm recorded is the
distribution, because that is what actually occurred; the destruction the
instructions described remained hypothetical, and recording it as realised
would overstate the event in exactly the direction this log exists to avoid.
