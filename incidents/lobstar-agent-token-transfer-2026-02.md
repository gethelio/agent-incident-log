---
id: lobstar-agent-token-transfer-2026-02
date: 2026-02-22
title: Trading agent sends its entire token balance after a session restart erases what it held
organization: not disclosed
scale: roughly 52.4 million tokens, about 5 per cent of the token's supply, transferred in place of an intended payment of about 310 US dollars; the developer put the loss at approximately 450,000 US dollars
surface: chat_agent
agent_stack:
  framework: OpenClaw
tools:
  - payments
harm:
  - financial_loss
harm_bearer: first_party
reversible: 'no'
root_cause:
  - context_loss
  - missing_approval_gate
  - no_spend_limit
prevented_by_action_governance: likely
control: >
  The agent intended to send about 310 US dollars and sent roughly 450,000.
  A per-transaction value cap, a percentage-of-balance cap, or an approval
  gate on transfers above a threshold each catch a discrepancy of that size,
  and each does so without needing to understand why the agent was wrong. The
  control works precisely because it evaluates the outgoing call against the
  wallet's actual state rather than against the agent's belief about it, and
  the agent's belief was the thing that had been corrupted.
sources:
  - url: https://pashpashpash.substack.com/p/my-lobster-lost-450000-this-weekend
    title: My lobster lost $450,000 this weekend
    publisher: Substack
    date: 2026-02-23
    primary: true
  - url: https://cointelegraph.com/news/openai-employee-s-ai-agent-accidentally-sent-442k-to-beggar
    title: AI Agent Lobstar Wilde Accidentally Sends $442K to Beggar
    publisher: Cointelegraph
    date: 2026-02-23
    primary: false
aiid_incident: null
helio_pack: null
last_verified: 2026-08-10
---

An independently built memecoin trading agent, launched on 20 February 2026
with 50,000 US dollars in funding and instructions to trade autonomously, was
running on an outdated version of the OpenClaw framework. Days earlier an
unrelated party had created a token in the agent's name and sent it five per
cent of the total supply, an allocation the agent had not asked for and had
not paid for.

On 22 February a tool call name exceeded the model provider's character limit.
The resulting malformed message made the session transcript unloadable, and
the agent had to be restarted. Workspace files survived the restart. The
conversation did not, and with it went the agent's awareness of what its own
wallet contained.

In the new session the agent saw a request on social media for roughly four
units of currency, reconstructed from older transcripts that it had made
similar small donations before, and decided to send about 310 US dollars worth
of tokens. It then checked its balance, found 52.4 million tokens, and treated
that figure as the amount to send. The recipient sold into thin liquidity
within about fifteen minutes, realising roughly 40,000 US dollars against a
transfer the developer valued at approximately 450,000.

The developer's published postmortem rules out two explanations that
circulated widely. It was not prompt injection, and it was not a decimal or
units error, though the latter account appeared in much of the contemporaneous
coverage after a social media user proposed it. The failure was state: no
mandatory balance verification before a transfer, no memory flush before the
crash, and no persistent tracking of financial position independent of the
conversation. Reported valuations range from roughly 250,000 to 550,000 US
dollars because the token's price moved sharply on the attention the incident
itself generated; the figure recorded here is the developer's own.
