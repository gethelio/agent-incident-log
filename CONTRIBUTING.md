# Contributing

**No programming skills are needed to contribute.** If you can fill in a short form or edit a text file, you can help.

## Two routes

1. **Open a pull request** with a full entry (preferred when you want to write it up yourself).
2. **Open an issue** if you know of an incident but do not want to write the entry. The Helio team will draft it from your links and notes. Use the [Submit an incident](https://github.com/gethelio/agent-incident-log/issues/new?template=submit-incident.yml) form.

## Submitting a pull request

1. Create `incidents/<your-slug>.md`. The slug becomes the immutable `id` (lowercase letters, digits, hyphens).
2. Copy the template from [EXAMPLE_INCIDENT.md](EXAMPLE_INCIDENT.md).
3. Delete the comments and unused optional fields.
4. Fill in the front matter and write the prose account in your own words.
5. Open a pull request. Complete the PR checklist, including the required justification for `prevented_by_action_governance`.

## Editorial rules

See [EDITORIAL_POLICY.md](EDITORIAL_POLICY.md) in full. In short: two independent sources, organizations not individuals, original prose, no call to action, and an honest `prevented_by_action_governance` value.

## Three fields that are easy to get wrong

- **`publisher`** is the platform, not the author, when a source is written by someone under their own name — `X`, `Substack`, `Medium`. Rule 2 keeps individuals out of entries, and a byline here would put them straight back in. Use the masthead for ordinary publications.
- **`reversible`** is `yes`, `no` or `unclear`. Quote `yes` and `no`: some YAML parsers read them as booleans. Reach for `unclear` when no source settles whether the harm was undone — `no` claims permanence, and claiming it unsourced is the kind of thing this log exists to avoid.
- **`tools`** may be empty (`[]`) only when `surface` is `infrastructure`, where no agent invokes anything. Everywhere else at least one value is required. Do not stretch for a loose fit just to fill it.

## After you submit

1. CI validates the schema and mechanical constraints.
2. A maintainer reviews the entry (including the governance justification).
3. `id` uniqueness is confirmed at review.
4. On merge, the entry is published to the dataset and goes live on [helio.so/incidents](https://helio.so/incidents) within minutes.
