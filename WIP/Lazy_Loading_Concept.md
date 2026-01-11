# Lazy Loading Concept

## Status: ✅ Implemented

**PR #18** - Merged into main

---

## Problem (Solved)

Die App lud beim Start **alle** Content-Dateien. Mit wachsendem Content wurde das immer langsamer.

## Lösung: Transparentes Lazy Loading

Statt des ursprünglich geplanten "Download Button" Modells wurde ein **transparentes** Lazy Loading implementiert:

- App lädt beim Start nur `modules.json` (~2KB)
- Vorlesungen werden automatisch geladen wenn der User sie öffnet
- Loading-Spinner zeigt Ladevorgang
- Suche funktioniert über vorgenerierten Index

### Vorteile der einfacheren Lösung

- ✅ Keine zusätzliche Komplexität für User (keine Download-Buttons)
- ✅ Funktioniert wie erwartet - klicken → laden → anzeigen
- ✅ Schneller App-Start
- ✅ Weniger Code zu warten

---

## Architektur

```text
App Start
    │
    ▼
modules.json (2KB)     ← Lädt sofort
content-manifest.json  ← Metadaten für alle Vorlesungen
    │
    ▼
User klickt Vorlesung
    │
    ▼
lecture-bundle.json    ← Lädt on-demand (10-80KB pro Vorlesung)
    │
    ▼
BundleLoader konvertiert → APP_CONTENT
    │
    ▼
Vorlesung wird angezeigt
```

### Generierte Dateien

| Datei                   | Beschreibung        | Größe   |
| ----------------------- | ------------------- | ------- |
| `modules.json`          | Modul-Metadaten     | ~2KB    |
| `content-manifest.json` | Checksummen, Größen | ~1KB    |
| `search-index.json`     | Such-Keywords       | ~15KB   |
| `lecture-bundle.json`   | Pro Vorlesung       | 10-80KB |

---

## Implementierte Komponenten

### Build-System (`scripts/`)

- `generate-content-list.js` - Erzeugt modules.json
- `generate-lecture-bundles.js` - Erzeugt Bundles + Manifest
- `generate-search-index.js` - Erzeugt Such-Index

**Ausführen:** `npm run build`

### Runtime (`js/`)

- `bundle-loader.js` - Lädt und konvertiert Bundles zu APP_CONTENT
- `download-manager.js` - IndexedDB-Speicher (für zukünftigen Offline-Support)

### App Integration

- `app.js` - `loadStudyContentLazy()` lädt nur Module
- `app.js` - `startLecture()`, `startQuiz()` laden Bundle bei Bedarf
- `modules.js` - `displayLecturesForModule()` zeigt Metadaten aus Manifest
- `search.js` - Nutzt `search-index.json` für Suche ohne geladene Inhalte
- `views.js` - `showLoadingOverlay()` für Lade-Feedback

---

## Offene Erweiterung: Offline-Support

Siehe **[Issue #19](https://github.com/rrust/ew-bachelor/issues/19)** für optionalen Offline-Support:

- Service Worker cacht Bundles
- Offline-Indicator in UI
- Explizite Download-Buttons (optional)

**Geschätzter Aufwand:** ~1 Tag
