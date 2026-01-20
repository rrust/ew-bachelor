# GitHub Copilot Instructions

## ⚠️ KRITISCHE REGELN

Diese Regeln dürfen **NIEMALS** missachtet werden:

### YAML & Markdown

- **YAML-Listen:** Immer `-` (dash), NIEMALS `*` (asterisk)
- **NIEMALS `---` im Markdown-Body** – Parser sieht es als YAML-Separator!
- **Horizontale Linie:** `***` oder einfach `##` Überschriften

### Content-Struktur

- **CONTENT_PLAN.md ist VERBINDLICH** – keine eigene Struktur erfinden!
- **Zielordner prüfen:** `studies-material/` und `content/` haben oft unterschiedliche Ordnernamen!
- **NIEMALS fehlende Items hinten anhängen** – an richtiger didaktischer Stelle einfügen
- **Interaktive Typen:** ALLE Felder ins YAML-Frontmatter (kein Markdown-Body!)

### Formatierung

- **NIEMALS ASCII-Art oder Box-Zeichnungen** – Tabellen, Listen, Mermaid stattdessen
- **Mermaid:** Nur `flowchart`, `graph`, `sequenceDiagram`, `classDiagram`, `stateDiagram`
- **Mermaid:** Max. 3-5 Wörter pro Box (Mobile!)
- **MC-Antworten:** Korrekte Antwort NICHT systematisch die längste!

### KaTeX

- **Aggregatzustände:** `\text{Na}_{\text{(s)}}` nicht `\text{Na}_{(s)}`
- **Ionen mit Aggregatzuständen vermeiden** – `\text{Na}^+_{(aq)}` rendert nicht!

## Spezialisierte Instruktionen

Detaillierte Anleitungen in `.github/copilot/`:

| Datei                                                        | Thema                       |
| ------------------------------------------------------------ | --------------------------- |
| [content-plan-creation.md](copilot/content-plan-creation.md) | CONTENT_PLAN.md erstellen   |
| [content-generation.md](copilot/content-generation.md)       | Inhalte aus Plan generieren |
| [content-types.md](copilot/content-types.md)                 | YAML-Referenz aller Types   |
| [validation.md](copilot/validation.md)                       | Validierungs-Befehle        |
| [git-workflow.md](copilot/git-workflow.md)                   | Branches, Commits, PRs      |
| [module-training.md](copilot/module-training.md)             | Training-Fragen             |
| [audio-scripts.md](copilot/audio-scripts.md)                 | Audio-Scripts erstellen     |
| [audio-generation.md](copilot/audio-generation.md)           | TTS-Generierung             |

## Quick Reference

### Tech Stack

- **Plain HTML/CSS/JS** – Kein React, Vue, TypeScript
- **Tailwind CSS via CDN** – Kein npm-basiertes CSS
- **Kein Build-Step** – Alles läuft direkt im Browser
- **localStorage** – Für Fortschritt, kein Backend

### Sprache

- **Code/Kommentare:** English
- **UI-Texte:** German
- **Commit Messages:** English

### Häufige Befehle

```bash
npm run build                    # JSON regenerieren
npm run validate:content         # Content prüfen
npm run validate:views           # Views prüfen
npx markdownlint-cli2 "**/*.md"  # Markdown linten (OHNE --fix!)
```

### Git

- **Niemals direkt auf `main`** – Feature-Branches!
- **Atomic Commits:** `feat:`, `fix:`, `docs:`, `content:`
- **PRs:** `gh pr create --title "..." --body "..."`

## Core Principles

1. **Keep it simple** – Keine Frameworks, kein Over-Engineering
2. **Work autonomously** – Fertig implementieren, dann Testing ankündigen
3. **Debug with evidence** – Console prüfen, nicht raten
4. **Validate content** – Tools → "Inhalte validieren" im Browser

## Don't

- Frameworks, TypeScript, Build-Tools hinzufügen
- Ohne Grund refactoren
- Bei Bug-Fixes raten ohne Console zu prüfen
- Jeden Schritt nachfragen

## Do

- Autonom arbeiten, am Ende Testing ankündigen
- Code einfach halten
- Kaputte Dinge reparieren
- Browser-Console zuerst prüfen
