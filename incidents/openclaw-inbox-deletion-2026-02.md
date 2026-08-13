---
id: openclaw-inbox-deletion-2026-02
date: 2026-02-23
title: Agent deletes a personal inbox after a context reset drops its confirmation instruction
organization: not disclosed
scale: several hundred messages deleted from one individual's personal email account
surface: chat_agent
agent_stack:
  framework: OpenClaw
tools:
  - comms
harm:
  - data_destruction
harm_bearer: first_party
reversible: unclear
root_cause:
  - context_loss
  - instruction_not_binding
  - missing_approval_gate
prevented_by_action_governance: likely
control: >
  The standing instruction was to propose deletions and wait. It survived only
  as conversation, so when the context window filled and earlier turns were
  compacted away, the constraint went with it. An approval gate on destructive
  mail operations holds the call regardless, because it lives outside the
  model's context and cannot be summarised out of existence. That is the whole
  argument for enforcing at the action layer rather than in the prompt.
sources:
  - url: https://x.com/summeryue0/status/2025774069124399363
    title: "Nothing humbles you like telling your OpenClaw \"confirm before acting\""
    publisher: X
    date: 2026-02-23
    primary: true
  - url: https://sfstandard.com/2026/02/25/openclaw-goes-rogue/
    title: Meta AI safety director lost control of her agent. It started deleting her emails
    publisher: The San Francisco Standard
    date: 2026-02-25
    primary: false
aiid_incident: null
helio_pack: null
last_verified: 2026-08-10
---

On 23 February 2026 a researcher who leads alignment work at a major AI lab
connected an OpenClaw agent to their personal email account, after several
weeks of testing it against a disposable inbox. The instruction was explicit
and conservative: review the messages, suggest what to archive or delete, and
take no action until told to.

The agent instead announced that it would delete everything not on a keep list
and older than 15 February, and began doing so. Stop commands sent from a
phone had no effect. The run ended only when the researcher physically reached
the machine the agent was running on and killed the process. Several hundred
messages were deleted.

The cause was compaction. As the working context filled, the agent condensed
earlier turns to make room, and the standing instruction to confirm before
acting was among what it summarised away. It was not overridden or reasoned
past; it stopped being present. Asked about it afterwards, the agent
acknowledged the instruction had existed and that it had violated it.

This is a first-party harm with no adversary and no compromised credential.
The agent was doing what it understood its principal to want, using access it
had legitimately been given, and the only thing that failed was the durability
of a constraint that existed solely as text in a context window. No source
addresses whether the deleted messages were later recoverable from the mail
provider, so `reversible` is `unclear`. It was recorded as `false` until the
schema gained a value for "nobody checked", which asserted a permanent loss no
source had established.
