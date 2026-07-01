<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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
