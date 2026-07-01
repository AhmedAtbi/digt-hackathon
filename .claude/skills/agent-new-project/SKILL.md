---
name: agent-new-project
description: Scaffold a brand-new project (frontend, backend, API, fullstack, or static site) using one of the bootstrap recipes, then run agent init so it's ready for the workflow framework before its first commit.
command: new-project
---

# agent-new-project

Walk the user through creating a new project from scratch.

When invoked:

1. **Ask what kind of project**:
   - Backend / API
   - Frontend (SPA or SSR)
   - Static site
   - Fullstack monorepo
2. **Within the chosen category, ask for the stack**. Default options:
   - Backend / API: PHP/Symfony (`php-symfony-api-platform`),
     PHP/Sylius (`php-sylius`), Node/NestJS (`node-nestjs`),
     Python/FastAPI (`python-fastapi`).
   - Frontend: Next.js (`web-nextjs`), Vite+React (`web-vite-react`).
   - Static site: Astro (`web-astro`).
   - Fullstack monorepo: Turborepo (`monorepo-turbo`).
   - Fullstack split (two sibling repos): Next.js + Symfony API
     (`fullstack-nextjs-symfony`).
3. **Ask for the project name. Default the target directory to the
   current working directory at invocation time** — `pwd` when the
   user typed `/new-project`. The new project lands as a child of
   wherever the user currently is:

   - User in `/var/www/html` runs `/new-project` → project lands at
     `/var/www/html/<NAME>`.
   - User in `/home/me/work` runs `/new-project` → project lands at
     `/home/me/work/<NAME>`.

   Override: if `.agent.local.yaml` → `new_project.root` is set to an
   absolute path, use that instead. Empty/unset = use PWD.

   **Safety net**: if PWD itself is a project that already contains
   `.agent/` (you'd be creating a nested project inside an existing
   consumer), warn explicitly: "you're inside a consuming project;
   nesting is rarely intended — proceed, choose PWD's parent, or
   abort?" Default to abort if the user doesn't answer.

   **Print the resolved path to the user** ("the project will be
   created at `<PWD>/<NAME>`") and **confirm** before anything
   destructive. If they want a different location, accept it.
4. **Don't `cd` away from PWD** before running the recipe — recipe
   commands like `composer create-project <NAME>`, `pnpm create
   next-app <NAME>`, `symfony new <NAME>` create the new directory
   as a child of the current directory. PWD is what we want.
5. **Read `.agent/bootstrap/<stack-slug>.md`** end-to-end.
6. **Walk the recipe with the user**. Run **one command at a time**:
   - State what you're about to do and why.
   - Run the command (the user approves via Claude's permission prompt).
   - Confirm success before the next step.
   - If a step fails, stop and ask before retrying.
7. **At the end of the recipe**, run `./.agent/bin/agent init` inside
   the new project to install adapters.
8. **Update `.agent.local.yaml`** with the project name, ticket prefix,
   task provider, and stack preset the user chose.
9. **Run `./.agent/bin/agent doctor`** and report any remaining warnings.
10. **Print a "next steps" summary**: open in your editor, set up the
    ClickUp/Linear/Jira IDs, type `/idea` to start the first ticket.

Never:
- Install OS packages or run package managers without user approval.
- Push to a remote — the user owns the first commit and push.
- Force-create directories that already contain files.
- Skip pre-commit hooks or run anything with `--no-verify`.

If the user already has a project and just wants to add the framework to
it, redirect them to `.agent/docs/adopting.md` instead.

If a recipe is missing for the stack they want, offer to draft a new
one as a file under `.agent/bootstrap/<slug>.md` and walk through it
collaboratively — the framework gains a recipe and the user gets their
project.
