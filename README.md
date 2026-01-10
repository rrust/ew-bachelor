# Nutritional Science Learning App

Eine spielerische Lern-App für Ernährungswissenschaften mit modularen Vorlesungen, Quizzes, Selbsttests und **Achievement-System** zur Motivation und Wiederholung.

## 🌐 Live App

**[https://rrust.github.io/ew-bachelor/](https://rrust.github.io/ew-bachelor/)**

## Features

- 📚 **Modulare Vorlesungen** mit verschiedenen Content-Typen
- 🎯 **Tests & Self-Assessments** für Wissensüberprüfung
- 🏆 **Achievement-System** mit nützlichen Lernhilfen (Cheat Sheets, etc.)
- 📊 **Progress Tracking** mit Badges und Statistiken
- 🗺️ **Studienstruktur-Map** zur Übersicht
- 🌓 **Dark Mode** Support

## Content Development

Alle Lerninhalte werden als Markdown-Dateien im `content/` Verzeichnis verwaltet. Die Struktur ist modular aufgebaut mit separaten Dateien für jede Vorlesung, jeden Lerninhalt und jede Quizfrage.

### Quick Start

1. **Neue Inhalte erstellen**: Verwende die Templates in [docs/CONTENT_TEMPLATES.md](docs/CONTENT_TEMPLATES.md)
2. **Content validieren**: Öffne `validate-content.html` im Browser oder nutze Header → "Tools" → "Content Validator"
3. **Markdown linten**: `npx markdownlint-cli2 "**/*.md"` (ohne `--fix`!)

### Wichtige Regeln

- **YAML-Listen**: Immer `-` (dash) verwenden, niemals `*` (Asterisk)
- **correctAnswer**: Muss exakt mit einer Option übereinstimmen (case-sensitive)
- **Nummerierung**: Dateien mit `NN-` Prefix für Sortierung
- **Validation**: Immer vor dem Commit validieren!

### Vollständige Dokumentation

→ **[docs/CONTENT_DEVELOPMENT.md](docs/CONTENT_DEVELOPMENT.md)**

Enthält:
- Detaillierte Content-Struktur und Formate
- YAML-Syntax-Regeln und häufige Fehler
- Validation-Workflow
- Best Practices
- Step-by-step Workflows für verschiedene Content-Typen

### Templates

→ **[docs/CONTENT_TEMPLATES.md](docs/CONTENT_TEMPLATES.md)**

Copy-paste Templates für:
- Vorlesungen (Metadata + Learning Items)
- Quizzes (Metadata + Questions)
- Alle Content-Typen (learning-content, self-assessment, videos, etc.)

## App Development

Für technische Details zur App-Entwicklung, siehe:

→ **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Setup, Tech Stack, Build & Run  
→ **[GEMINI.md](GEMINI.md)** - Architektur und Coding-Konventionen  
→ **[docs/AI_CODING.md](docs/AI_CODING.md)** - AI-gestützte Entwicklung

## Projekt-Dokumentation

### Content

- **[docs/CONTENT_DEVELOPMENT.md](docs/CONTENT_DEVELOPMENT.md)** - Hauptdokumentation für Content-Entwicklung
- **[docs/CONTENT_TEMPLATES.md](docs/CONTENT_TEMPLATES.md)** - Copy-paste Templates
- **[studium/](studium/)** - Referenzmaterialien (Curriculum)

### Development

- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Development Environment Setup
- **[GEMINI.md](GEMINI.md)** - App-Architektur und Coding Guidelines
- **[docs/AI_CODING.md](docs/AI_CODING.md)** - AI-Workflow

### Planning

- **[WIP/Achievement_System_Concept.md](WIP/Achievement_System_Concept.md)** - Achievement System Design & Implementation
- **[WIP/Learning_Flow_Concept.md](WIP/Learning_Flow_Concept.md)** - Feature Planning
- **[WIP/Nice_To_Have_Features.md](WIP/Nice_To_Have_Features.md)** - Enhancement Ideas
