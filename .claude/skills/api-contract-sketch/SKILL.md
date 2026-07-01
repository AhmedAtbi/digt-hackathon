---
name: api-contract-sketch
description: Draft the API / data contract a story needs before build. Invoke at Solution Shape after UX states are known.
stage: Solution Shape
owner: BE
ai_role: propose
applies_to: [PoS, ERP]
---

# API Contract Sketch

## When to use
UX states and ACs exist. Define the data shape so FE and BE agree before any code.

## Inputs
- ACs + UX state list (states reveal required fields).
- Existing endpoint / entity context.

## Steps
1. Propose endpoints/messages: method, path, request, response shape.
2. Map each response field to the UX state or AC that needs it.
3. Note new vs existing entities and any migration implied.
4. Flag contract risks (breaking change, versioning) as questions.

## Output — artifact as proof
Proposed contract: endpoints/messages, request/response schemas, field→need mapping, data dependencies.

## Human gate
BE + FE agree the contract is buildable and stable; Lead confirms no unplanned public-contract break.

## Guardrails
- AI proposes the contract; engineers commit.
- Never change an existing public route/shape/message name without an explicit requirement — flag it instead.

## Coding standards
Apply the target stack's column from `${CLAUDE_PLUGIN_ROOT}/CONVENTIONS.md` — **CMS** (PHP 8.4 / Symfony 7, PHPStan 6, no `Service` namespace), **ERP** (PHP 8.2 / Symfony 6, PHPStan 8, php-cs-fixer + rector), **iPaaS** (PHP 8.2 / Symfony 6.4, PHPStan max), **FE** (Next 13 / TS 4.9, ESLint + Prettier-tabs, orval, i18n, price units). The stacks differ — never cross idioms or PHP versions.

## PoS vs ERP notes
- **PoS:** match field names to the CMS `*View.php` classes (FE binds to view fields, which differ from entity names) — check the view before naming.
- **ERP:** the contract change almost always belongs in **CMS** (the proxy just forwards). Only sketch an ERP-side change if the proxy route/method/shape itself must change.
