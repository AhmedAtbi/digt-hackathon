
<!-- agent-framework:start -->
## Workflow framework

This project uses the [agent workflow framework](.agent/README.md). The full
SDLC (stages 00–14) and per-stage prompts live under `.agent/workflow/`.
Adapter files for Claude Code live under `.claude/skills/agent-*/` and
`.claude/commands/`.

To re-sync after a framework update:

```bash
git -C .agent pull
./.agent/bin/agent sync
```

Per-project overrides live in `.agent.local.yaml`. See
`.agent/docs/customizing.md`.
<!-- agent-framework:end -->
