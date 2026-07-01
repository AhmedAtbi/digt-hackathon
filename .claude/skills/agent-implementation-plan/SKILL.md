---
name: agent-implementation-plan
description: Run workflow stage "06-implementation-plan". Reads the canonical prompt from .agent/workflow/06-implementation-plan/prompt.md.
---

# agent-implementation-plan

This skill drives workflow stage **`06-implementation-plan`**. The canonical instructions
live in the framework at `.agent/workflow/06-implementation-plan/prompt.md` — read that
first, then follow the steps.

When this skill is invoked:

1. Read `.agent/workflow/06-implementation-plan/prompt.md` end-to-end.
2. Read any `templates/*.md` or `checklist.md` it references.
3. Check the project's `.agent.local.yaml` for path overrides
   (`paths.<stage-output>`).
4. Execute the steps; write artifacts to the configured `docs/` location.
5. Emit the JSON confidence block at the end of the artifact.

If `.agent/` is missing, the framework submodule isn't initialised:
ask the user to run `git submodule update --init --recursive`.
