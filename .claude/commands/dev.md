---
description: Spawn the dev-agent subagent.
---

Use the Task tool with `subagent_type: dev-agent`. Pass any
user-supplied arguments through as the agent's input (typically a
ticket ID or URL).

The dev-agent subagent runs with its own context window, its own
system prompt (`.claude/agents/dev-agent.md`), and its own tool
allowlist. It returns its final report to this conversation when it
finishes or hits a human gate.
