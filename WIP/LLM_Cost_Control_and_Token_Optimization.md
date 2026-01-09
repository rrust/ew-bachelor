# WIP — Cost Control + Token Optimization Concept (LLM-assisted content work in repo)

This document proposes a practical, student-budget-friendly concept to control costs and optimize token usage while maintaining a nutrition-science learning app repository (Markdown content, quizzes, Mermaid graphs, media references, JSON/YAML).

The goal: **use expensive models rarely**, **use cheap/local models often**, and **reduce tokens per request** via workflow + tooling.

---

## 1) Core Principles

### 1.1 Route tasks to the cheapest capable model

Not every task needs “deep reasoning”.

**Typical task → cheapest model that still does it well:**
- **Formatting / refactoring Markdown** (headings, tables, consistent style) → cheap or local
- **Generate quizzes from already clean notes** → cheap or local
- **Mermaid diagrams from bullet structure** → cheap or local
- **Hard conceptual synthesis / conflicting sources / exam-style tricky reasoning** → premium model (Gemini Pro trial / occasionally Claude)
- **Final “quality pass” on a chapter** → premium model only after drafts are already good

**Rule of thumb:** Premium models should see **small, clean inputs** and do **high-leverage thinking**, not bulk formatting.

---

## 2) Token Optimization Tactics

### 2.1 Work on diffs, not whole files

Always send:
- file path
- exact section
- diff or changed paragraph
- constraints (format, length, exam focus)

This typically cuts tokens by **70–95%**.

---

### 2.2 Two-pass workflow: compress → transform

For large sources:

1) **Compression pass** → fact sheet:
- definitions
- mechanisms (cause → effect)
- key numbers
- misconceptions
- exam traps

1) **Transformation pass**:
- lesson markdown
- quizzes
- mermaid diagrams

---

### 2.3 Structured prompts & outputs

Use fixed templates and schemas to reduce retries and drift.

---

### 2.4 Avoid re-sending reference context

Create repo-local references:
- glossary
- formulas
- units
- pathways

Reference them instead of pasting repeatedly.

---

### 2.5 Chunking rules

- < 1,500 words per request
- chunk by concept
- one chunk → one output

---

### 2.6 Explicitly reject fluff

Always instruct:
> No filler, no repetition, exam-focused only.

---

## 3) Repository Implementation Plan

### 3.1 Prompt library

```text
llm/
  rules/
  prompts/
  schemas/
```

Benefits:
- shorter prompts
- consistent outputs
- fewer retries

---

### 3.2 Token budget policy

Define budgets per task type (micro-edit, quiz gen, compression).

---

### 3.3 Token estimation & logging

Add scripts to estimate tokens and log usage to `.llm/usage.jsonl`.

Track:
- timestamp
- model
- estimated tokens
- task type
- file paths

---

### 3.4 Diff-only helpers

Scripts to extract:
- markdown sections
- line ranges
- git diffs

---

### 3.5 Cache intermediate artifacts

Store:
- fact sheets
- quiz drafts
- diagram drafts

Regenerate only when inputs change.

---

## 4) Cheap → Premium Workflow

1) Draft with cheap/local model
2) Think with premium model
3) Finalize with cheap/local model

---

## 5) Prompt Templates (suggested)

- compress-to-facts
- facts-to-lesson
- lesson-to-quiz
- lesson-to-mermaid

---

## 6) Cost Control Checklist

Before prompting:
- minimal context
- correct model tier
- fixed output format
- length caps

After prompting:
- store artifacts
- log usage
- improve prompt, not retries

---

## 7) Minimal VSCode Setup

- prompt snippets
- extraction scripts
- markdown linting
- schema validation

---

## 8) Next Steps

1) Add STYLE rules
2) Add prompt templates
3) Start diff-only prompting
4) Log usage consistently
5) Reserve premium models for correctness

---

## Implementation Plan

### Phase 1: Foundation & Infrastructure (Week 1)

**Goal:** Set up basic structure for cost-controlled LLM workflows

- **[ ] Task 1.1: Create .llm/ Directory Structure**
  - **AC:** Create `.llm/prompts/`, `.llm/rules/`, `.llm/schemas/` directories
  - **AC:** Add `.llm/usage.jsonl` for token logging
  - **AC:** Add `.llm/` to `.gitignore` (or selective include for prompts/rules)
  - **AC:** Create README in `.llm/` documenting structure
  - **Effort:** Low (1 day) - Basic setup

- **[ ] Task 1.2: Create Core Prompt Templates**
  - **AC:** Template for content compression (`compress-source.md`)
  - **AC:** Template for quiz generation (`facts-to-quiz.md`)
  - **AC:** Template for lesson creation (`facts-to-lesson.md`)
  - **AC:** Template for Mermaid diagrams (`create-mermaid.md`)
  - **AC:** Each template includes: goal, input format, output format, constraints
  - **Effort:** Medium (2-3 days) - Requires testing with different models

- **[ ] Task 1.3: Document Style Rules**
  - **AC:** Create `.llm/rules/content-style.md` with formatting rules
  - **AC:** Define: heading levels, list styles, emphasis usage, length targets
  - **AC:** Add domain-specific rules: terminology, abbreviations, units
  - **AC:** Add exam-focused writing guidelines (concise, precise, no fluff)
  - **Effort:** Low (1 day) - Based on existing content

### Phase 2: Token Optimization Tools (Week 2)

**Goal:** Build utilities to reduce token usage and track costs

- **[ ] Task 2.1: Create Diff-Only Helper Scripts**
  - **AC:** `scripts/extract-section.js` - Extract markdown sections by heading
  - **AC:** `scripts/extract-lines.js` - Extract specific line ranges
  - **AC:** `scripts/prepare-diff.js` - Format git diffs for LLM consumption
  - **AC:** Each script outputs to stdout for piping to clipboard or LLM
  - **AC:** Add usage examples in script comments
  - **Effort:** Medium (2-3 days) - Node.js scripting

- **[ ] Task 2.2: Implement Token Estimation**
  - **AC:** Install `tiktoken` or similar library for token counting
  - **AC:** Create `scripts/estimate-tokens.js` for pre-submission estimation
  - **AC:** Support for text files, markdown files, and stdin
  - **AC:** Display warnings when exceeding budget thresholds
  - **AC:** Output format: `Estimated tokens: 1,234 (~$0.05 with GPT-4)`
  - **Effort:** Low (1-2 days) - Library integration

- **[ ] Task 2.3: Add Usage Logging System**
  - **AC:** Create `scripts/log-usage.js` for manual logging after LLM interactions
  - **AC:** Interactive CLI prompts for: model, task type, estimated tokens, files affected
  - **AC:** Append to `.llm/usage.jsonl` with timestamp
  - **AC:** Create `scripts/analyze-usage.js` for cost reports and statistics
  - **AC:** Reports show: total tokens/cost by model, by task type, trends over time
  - **Effort:** Medium (3-4 days) - CLI development and data analysis

### Phase 3: Model Tier Strategy (Week 3)

**Goal:** Document and implement cost-optimized model routing

- **[ ] Task 3.1: Create Model Tier Matrix**
  - **AC:** Document in `docs/AI_CODING.md` under new "Cost Optimization" section
  - **AC:** Matrix includes: task type, recommended model tier, max token budget
  - **AC:** Define tiers: Free/Local (Gemini 2.5 Flash Free), Cheap (API models), Premium (Claude/GPT-4)
  - **AC:** Add decision tree: "When to use which model?"
  - **AC:** Include cost per 1M tokens for reference
  - **Effort:** Low (1 day) - Documentation and research

- **[ ] Task 3.2: Define Token Budgets Per Task**
  - **AC:** Micro-edit (typo, formatting): 500 tokens max
  - **AC:** Quiz generation (from structured notes): 2,000 tokens max
  - **AC:** Content compression: 1,500 tokens max
  - **AC:** Lesson creation (from facts): 3,000 tokens max
  - **AC:** Mermaid diagram: 1,500 tokens max
  - **AC:** Conceptual synthesis: 5,000 tokens max
  - **AC:** Quality pass / review: 3,000 tokens max
  - **AC:** Add enforcement in prompt templates (e.g., "Budget: 2000 tokens")
  - **Effort:** Low (1 day) - Policy definition

- **[ ] Task 3.3: Establish Two-Pass Workflow**
  - **AC:** Document compression → transformation workflow in AI_CODING.md
  - **AC:** Create example workflow: PDF → facts → lesson → quiz
  - **AC:** Add pre-commit checklist: "Did you compress before transforming?"
  - **AC:** Create "compression first" policy for source material >5000 words
  - **Effort:** Low (1 day) - Documentation and workflow design

### Phase 4: Caching & Reuse (Week 4)

**Goal:** Avoid redundant LLM calls by caching intermediate artifacts

- **[ ] Task 4.1: Create Cache Directory Structure**
  - **AC:** Add `.llm/cache/` directory (git-ignored)
  - **AC:** Subdirectories: `fact-sheets/`, `quiz-drafts/`, `diagram-drafts/`
  - **AC:** Naming convention: `{module-id}_{lecture-id}_{type}.md`
  - **AC:** Add timestamps or hashes to detect when regeneration needed
  - **Effort:** Low (1 day) - Directory setup

- **[ ] Task 4.2: Document Caching Strategy**
  - **AC:** When to cache: after compression, after quiz generation, after diagrams
  - **AC:** When to regenerate: when source content changes (git diff detection)
  - **AC:** Manual cache clearing: `npm run clear-llm-cache` script
  - **AC:** Add guidelines: "Always check cache before prompting"
  - **Effort:** Low (1 day) - Documentation and simple script

- **[ ] Task 4.3: Create Reference Library**
  - **AC:** `content/reference/glossary.md` - Domain terminology definitions
  - **AC:** `content/reference/formulas.md` - Common formulas and equations
  - **AC:** `content/reference/units.md` - Standard units and conversions
  - **AC:** `content/reference/pathways.md` - Metabolic pathway summaries
  - **AC:** Update prompt templates to reference these files instead of repeating
  - **Effort:** Medium (3-4 days) - Content creation and curation

### Phase 5: VS Code Integration (Week 5)

**Goal:** Streamline workflows with editor shortcuts and snippets

- **[ ] Task 5.1: Create VS Code Snippets**
  - **AC:** Snippets for common prompt templates (accessible via `.vscode/`)
  - **AC:** Trigger: `llm-compress` → Full compression prompt template
  - **AC:** Trigger: `llm-quiz` → Quiz generation prompt
  - **AC:** Trigger: `llm-lesson` → Lesson creation prompt
  - **AC:** Trigger: `llm-mermaid` → Mermaid diagram prompt
  - **AC:** Each snippet includes: context placeholders, budget reminder
  - **Effort:** Low (1 day) - JSON snippet file

- **[ ] Task 5.2: Add VS Code Tasks**
  - **AC:** Task: "Estimate Tokens in Selection" - Runs estimate script on selected text
  - **AC:** Task: "Log LLM Usage" - Opens interactive logging CLI
  - **AC:** Task: "View Usage Report" - Displays cost analysis in terminal
  - **AC:** Task: "Extract Section" - Prompts for heading, outputs to clipboard
  - **AC:** Add to `.vscode/tasks.json` with keyboard shortcuts
  - **Effort:** Medium (2-3 days) - VS Code task configuration

- **[ ] Task 5.3: Create Pre-Commit Hook**
  - **AC:** Optional hook warns if LLM cache is stale
  - **AC:** Optional hook checks for large uncommitted fact sheets
  - **AC:** Hook reminds to log LLM usage if `.llm/usage.jsonl` not updated recently
  - **AC:** Non-blocking (warnings only, doesn't prevent commit)
  - **Effort:** Low (1-2 days) - Git hook scripting

### Phase 6: Monitoring & Optimization (Week 6+)

**Goal:** Continuously improve cost efficiency based on real usage

- **[ ] Task 6.1: Monthly Cost Review**
  - **AC:** Review `.llm/usage.jsonl` monthly
  - **AC:** Identify: most expensive tasks, most used models, budget overruns
  - **AC:** Optimize prompts for frequently-used tasks
  - **AC:** Adjust budgets based on actual usage patterns
  - **AC:** Document learnings in `.llm/optimization-log.md`
  - **Effort:** Ongoing (1-2 hours per month)

- **[ ] Task 6.2: Prompt Template Refinement**
  - **AC:** Track success rate of each prompt template
  - **AC:** Measure: retries needed, output quality, token efficiency
  - **AC:** Iterate on templates to reduce retries and improve outputs
  - **AC:** Version prompt templates (v1, v2, etc.) to track improvements
  - **Effort:** Ongoing (as usage data accumulates)

- **[ ] Task 6.3: Explore Local Models**
  - **AC:** Test local models (Ollama, LM Studio) for simple tasks
  - **AC:** Benchmark quality vs. API models for: formatting, quizzes, diagrams
  - **AC:** Document which tasks are "good enough" with free/local models
  - **AC:** Update model tier matrix with local model recommendations
  - **Effort:** Medium (3-5 days) - Testing and benchmarking

## Success Metrics

- [ ] Token budget adherence > 90% (tasks stay within defined budgets)
- [ ] Monthly LLM costs < $20 (target for content-heavy work)
- [ ] Cache hit rate > 50% (reusing artifacts instead of regenerating)
- [ ] Prompt retry rate < 10% (well-structured prompts work first time)
- [ ] > 80% of tasks use appropriate model tier (not over-spending on simple tasks)
- [ ] Documentation complete: all workflows, tools, and strategies documented

## Priority Ranking

### 🔴 High Priority (Immediate Cost Savings)

1. Task 1.2: Core prompt templates (Week 1) - Prevents inefficient prompting
2. Task 2.1: Diff-only helpers (Week 2) - Biggest token reduction
3. Task 3.1 & 3.2: Model tier strategy and budgets (Week 3) - Strategic cost control
4. Task 4.3: Reference library (Week 4) - Reduce repeated context

### 🟡 Medium Priority (Efficiency & Tracking)

1. Task 2.2 & 2.3: Token estimation and logging (Week 2) - Visibility
2. Task 4.1 & 4.2: Caching infrastructure (Week 4) - Avoid redundant work
3. Task 5.1: VS Code snippets (Week 5) - Developer experience
4. Task 6.1: Monthly reviews (Ongoing) - Continuous improvement

### 🟢 Low Priority (Nice to Have)

1. Task 1.1: Directory structure (Week 1) - Can start simple
2. Task 2.3: Usage analysis tools (Week 2) - Can be manual initially
3. Task 5.2 & 5.3: Advanced VS Code integration (Week 5) - Quality of life
4. Task 6.3: Local model exploration (Week 6+) - Experimental

## Implementation Notes

- **Parallel work possible:** Foundation (Phase 1) and Tools (Phase 2) can overlap
- **Start simple:** Begin with manual workflows, automate incrementally
- **Measure first:** Establish baseline costs before optimizing
- **Focus on habits:** Best tool is discipline—compress first, choose right model, set budgets
- **Iterate:** Refine based on actual usage patterns, not assumptions

---
