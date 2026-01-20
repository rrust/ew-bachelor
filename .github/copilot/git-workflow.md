# Git Workflow

Branch-Policy, Commits und Pull Requests.

## Branch-Policy

⚠️ **NIEMALS direkt auf `main` committen!**

```bash
# Feature-Branch erstellen
git checkout -b feature/descriptive-name

# Arbeiten, committen...

# Push
git push -u origin feature/branch-name

# PR erstellen
gh pr create
```

## Atomic Commits

**Ein logischer Change pro Commit!**

✅ **Gut:**

```bash
git commit -m "feat: add update banner component"
git commit -m "fix: correct answer validation"
git commit -m "content: add cell biology lecture"
```

❌ **Schlecht:**

```bash
git commit -m "add update system and fix content and update docs"
```

## Commit Messages

Conventional Commit Format:

| Prefix      | Verwendung                    |
| ----------- | ----------------------------- |
| `feat:`     | Neue Features                 |
| `fix:`      | Bug-Fixes                     |
| `docs:`     | Dokumentation                 |
| `content:`  | Lerninhalte                   |
| `refactor:` | Code-Umbau ohne neue Funktion |
| `style:`    | Formatierung, Whitespace      |
| `test:`     | Tests hinzufügen/ändern       |

## GitHub CLI (`gh`)

**Immer `gh` für Pull Requests verwenden!**

```bash
# Installation (falls nötig)
brew install gh
gh auth login

# PR erstellen
gh pr create --title "feat: description" --body "Details"

# Interaktiv
gh pr create

# Status prüfen
gh pr status

# Mergen
gh pr merge --squash
```

## Destructive Commands ⚠️

**Vor Ausführung IMMER `git status` prüfen!**

| Befehl               | Wirkung                       |
| -------------------- | ----------------------------- |
| `git restore <path>` | Uncommitted Changes verwerfen |
| `git reset --hard`   | ALLES uncommitted verwerfen   |
| `git clean -fd`      | Untracked Files löschen       |

## Typischer Workflow

```bash
# 1. Aktuellen Stand holen
git checkout main
git pull

# 2. Feature-Branch erstellen
git checkout -b feature/add-ionenbindung-lecture

# 3. Arbeiten
# ... Dateien erstellen/bearbeiten ...

# 4. Atomic Commits
git add content/bsc-ew/01-chemie/05-ionenbindung/
git commit -m "content: add ionenbindung lecture items"

git add content/bsc-ew/01-chemie/05-ionenbindung/questions/
git commit -m "content: add ionenbindung quiz questions"

# 5. Push
git push -u origin feature/add-ionenbindung-lecture

# 6. PR erstellen
gh pr create --title "content: add Ionenbindung lecture" \
  --body "Adds complete lecture for Ionenbindung with 12 quiz questions"

# 7. Nach Review: Merge
gh pr merge --squash
```

## Konflikt-Auflösung

```bash
# Main aktualisieren
git checkout main
git pull

# Zurück zum Feature-Branch
git checkout feature/my-branch

# Main reinmergen
git merge main

# Konflikte lösen, dann:
git add .
git commit -m "fix: resolve merge conflicts"
git push
```
