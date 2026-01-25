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

- **NIEMALS ASCII-Art oder Box-Zeichnungen** – Tabellen, Listen, Mermaid oder SVG stattdessen
- **Diagramme:** Mermaid ODER Inline-SVG (siehe unten)
- **Mermaid:** Nur `flowchart`, `graph`, `sequenceDiagram`, `classDiagram`, `stateDiagram`
- **Mermaid:** Max. 3-5 Wörter pro Box (Mobile!)
- **Inline-SVG:** KEINE Zeilenumbrüche im `<svg>`-Tag – alles in einer Zeile!
- **SVG-Beispiel:** `<svg viewBox="0 0 320 220" style="max-width: 400px; width: 100%;" aria-label="Beschreibung">...</svg>`
- **MC-Antworten:** Korrekte Antwort NICHT systematisch die längste!

### KaTeX

- **Aggregatzustände:** `\text{Na}_{\text{(s)}}` nicht `\text{Na}_{(s)}`
- **Ionen mit Aggregatzuständen vermeiden** – `\text{Na}^+_{(aq)}` rendert nicht!

### Video-Validierung

- **IMMER `npm run validate:videos`** – NIEMALS manuelle curl-Befehle!
- **Script findet alle Videos automatisch** – prüft oEmbed + simpleclub-Blacklist

## Spezialisierte Instruktionen

Detaillierte Anleitungen in `.github/copilot/`:

| Datei                                                        | Thema                        |
| ------------------------------------------------------------ | ---------------------------- |
| [content-plan-creation.md](copilot/content-plan-creation.md) | CONTENT_PLAN.md erstellen    |
| [content-generation.md](copilot/content-generation.md)       | **10-Schritte-Workflow**     |
| [content-verification.md](copilot/content-verification.md)   | **Vollständigkeits-Prüfung** |
| [content-types.md](copilot/content-types.md)                 | YAML-Referenz aller Types    |
| [validation.md](copilot/validation.md)                       | Validierungs-Befehle         |
| [git-workflow.md](copilot/git-workflow.md)                   | Branches, Commits, PRs       |
| [module-training.md](copilot/module-training.md)             | Training-Fragen              |
| [audio-workflow.md](copilot/audio-workflow.md)               | **Audio für Lerninhalte**    |
| [audio-scripts.md](copilot/audio-scripts.md)                 | Audio-Script Format          |
| [audio-generation.md](copilot/audio-generation.md)           | TTS-Generierung Details      |
| [video-workflow.md](copilot/video-workflow.md)               | **YouTube-Videos finden**    |

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
npm run validate:videos          # YouTube-Videos prüfen (oEmbed)
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
