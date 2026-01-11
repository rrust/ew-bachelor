# Lazy Loading Concept

## Problem

Die App lädt beim Start **alle** Content-Dateien für den aktiven Studiengang. Bei BSc Ernährungswissenschaften sind das aktuell ~235 Markdown-Dateien. Mit wachsendem Content wird das immer langsamer.

**Aktuelle Ladezeit (geschätzt):**
- Erster Besuch (ohne Cache): 5-10 Sekunden
- Mit Service Worker Cache: 2-3 Sekunden
- Bei 500+ Dateien: Deutlich länger

---

## Lösung: "Video on Demand" Modell

Wie bei einem Streaming-Dienst: Vorlesungen werden erst geladen wenn der User sie "auscheckt".

### Benutzer-Flow

1. **Modul-Karte** zeigt Download-Status aller Vorlesungen
   - ⬇️ 0/5 heruntergeladen
   - ⬇️ 3/5 heruntergeladen
   - ✅ 5/5 vollständig

2. **Vorlesungs-Übersicht** zeigt statt "Vorlesung starten":
   - **"Download"** - Wenn Daten nicht geladen (mit Fortschrittsanzeige)
   - **"Sync"** - Wenn Checksumme nicht übereinstimmt (Update verfügbar)
   - **"Vorlesung starten"** - Wenn Daten aktuell sind

3. **Offline-Nutzung** - Heruntergeladene Vorlesungen funktionieren offline

### Datenmodell

```javascript
// In localStorage: downloadedLectures
{
  "bsc-ernaehrungswissenschaften": {
    "01-ernaehrungslehre/01-grundlagen-zellbiologie": {
      "checksum": "a1b2c3d4",
      "downloadedAt": "2026-01-11T10:30:00Z",
      "version": "1.0.0"
    },
    "02-chemie-grundlagen/03-chemische-reaktionen": {
      "checksum": "e5f6g7h8",
      "downloadedAt": "2026-01-10T14:20:00Z",
      "version": "1.0.0"
    }
  }
}
```

### Server-seitige Struktur

```text
content/bsc-ernaehrungswissenschaften/
├── modules.json              # Lädt beim App-Start (klein)
├── content-manifest.json     # NEU: Checksummen aller Vorlesungen
│   └── { "01-modul/01-vorlesung": { checksum: "abc", files: [...] } }
└── 01-ernaehrungslehre/
    └── 01-grundlagen-zellbiologie/
        ├── lecture-bundle.json   # NEU: Kompilierte Vorlesung (alle Items + Quiz)
        └── [original .md files]  # Source files für Build
```

---

## UI-Elemente

### Modul-Karte (Module View)

```text
┌─────────────────────────────────┐
│ 📘 Ernährungslehre Grundlagen   │
│                                 │
│ 5 Vorlesungen                   │
│ ⬇️ 2/5 heruntergeladen          │  ← NEU: Download-Status
│                                 │
│ [Modul öffnen]                  │
└─────────────────────────────────┘
```

### Vorlesungs-Übersicht (Lecture Overview)

**Nicht heruntergeladen:**

```text
┌─────────────────────────────────┐
│ Chemische Reaktionen            │
│                                 │
│ ☁️ Nicht heruntergeladen        │
│ Größe: ~45 KB                   │
│                                 │
│ [⬇️ Herunterladen]              │  ← Download-Button
└─────────────────────────────────┘
```

**Während Download:**

```text
┌─────────────────────────────────┐
│ Chemische Reaktionen            │
│                                 │
│ ████████░░░░░░░░ 45%            │  ← Fortschrittsbalken
│ Lade Inhalte...                 │
│                                 │
└─────────────────────────────────┘
```

**Update verfügbar:**

```text
┌─────────────────────────────────┐
│ Chemische Reaktionen            │
│                                 │
│ 🔄 Update verfügbar             │
│                                 │
│ [🔄 Synchronisieren]            │  ← Sync-Button
│ [▶️ Vorlesung starten]          │  ← Alte Version nutzbar
└─────────────────────────────────┘
```

**Aktuell:**

```text
┌─────────────────────────────────┐
│ Chemische Reaktionen            │
│                                 │
│ ✅ Heruntergeladen              │
│ Zuletzt: 11.01.2026             │
│                                 │
│ [▶️ Vorlesung starten]          │
└─────────────────────────────────┘
```

---

## Implementierungsplan

### Phase 1: Build-System (Vorbereitung)

1. **`generate-lecture-bundles.js`** erstellen
   - Liest alle lecture-items und questions
   - Erzeugt `lecture-bundle.json` pro Vorlesung
   - Berechnet SHA-256 Checksumme

2. **`content-manifest.json`** generieren
   - Liste aller Vorlesungen mit Checksummen
   - Dateigrößen für Download-Anzeige
   - Lädt beim App-Start (klein, ~2KB)

### Phase 2: Download-Manager

1. **`js/download-manager.js`** erstellen

   ```javascript
   window.DownloadManager = {
     // Status einer Vorlesung prüfen
     getStatus(moduleId, lectureId) → 'not-downloaded' | 'outdated' | 'current'
     
     // Vorlesung herunterladen
     async download(moduleId, lectureId, onProgress) → boolean
     
     // Alle Downloads für ein Modul
     getModuleDownloadStatus(moduleId) → { downloaded: 3, total: 5 }
     
     // Geladene Daten abrufen
     getLectureData(moduleId, lectureId) → { items: [...], quiz: [...] }
   }
   ```

2. **localStorage Struktur**
   - Checksummen in `downloadedLectures`
   - Actual content in IndexedDB (größere Datenmengen)

### Phase 3: UI Integration

1. **Modul-Karten** - Download-Counter anzeigen
2. **Lecture-Overview** - Download/Sync/Start Buttons
3. **Fortschrittsanzeige** - Während Download

### Phase 4: Offline-Support

1. **Service Worker** erweitern für Bundles
2. **Offline-Indicator** in UI
3. **Konflikt-Handling** bei Updates

---

## Checksummen-Berechnung

```javascript
// generate-lecture-bundles.js
const crypto = require('crypto');

function calculateChecksum(content) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(content))
    .digest('hex')
    .substring(0, 8); // Kurze Version reicht
}
```

---

## Aufwand

| Phase                     | Geschätzter Aufwand | Priorität |
| ------------------------- | ------------------- | --------- |
| Phase 1: Build-System     | 1 Tag               | Hoch      |
| Phase 2: Download-Manager | 1-2 Tage            | Hoch      |
| Phase 3: UI Integration   | 1-2 Tage            | Hoch      |
| Phase 4: Offline-Support  | 1 Tag               | Mittel    |

**Gesamt: ~4-6 Tage**

---

## Vorteile

- ⚡ **Sofortiger App-Start** - Nur ~5KB laden statt 500KB+
- 📱 **Datensparen** - Nur genutzte Vorlesungen laden
- 🔄 **Sichtbare Updates** - User sieht wenn Content aktualisiert wurde
- 📴 **Echte Offline-Fähigkeit** - Heruntergeladene Vorlesungen immer verfügbar
- 🎯 **Intuitive UX** - Bekanntes Pattern von Streaming-Diensten

---

## Status

- [x] Konzept reviewed
- [x] Entscheidung: VOD-Modell mit Checksummen
- [x] Phase 1: Build-System (`generate-lecture-bundles.js`)
- [x] Phase 2: Download-Manager (`js/download-manager.js`)
- [x] Phase 3: UI Integration (`js/bundle-loader.js`, `app.js` Anpassungen)
- [ ] Phase 4: Offline-Support

### Implementierte Features

1. **Build-System**
   - `npm run build` generiert alle JSON-Dateien
   - `lecture-bundle.json` pro Vorlesung
   - `content-manifest.json` mit Checksummen

2. **Download-Manager**
   - IndexedDB für Bundle-Speicherung
   - Status-Tracking (not-downloaded, outdated, current)
   - Download mit Fortschrittsanzeige

3. **Bundle-Loader**
   - Konvertiert Bundles zu APP_CONTENT Format
   - Lädt aus IndexedDB oder Netzwerk
   - Injiziert Lectures on-demand

4. **App Integration**
   - `startLecture()` lädt Bundle bei Bedarf
   - `showLectureOverview()` unterstützt Lazy Loading
   - `startQuiz()` lädt Bundle bei Bedarf
   - `displayLecturesForModule()` zeigt Lecture-Metadaten aus Manifest
   - `getModuleStats()` arbeitet mit MODULES und Progress
   - Manifest wird beim App-Start geladen

### Bekannte Einschränkungen

*Keine mehr* - Alle Kernfunktionen unterstützen Lazy Loading.

### Nächste Schritte

1. **Offline-Support** - Service Worker für Bundles
2. **Download-UI** - Optionale Buttons zum Herunterladen für Offline-Nutzung

### Implementierte Features

1. **Build-System**
   - `npm run build` generiert alle JSON-Dateien
   - `lecture-bundle.json` pro Vorlesung
   - `content-manifest.json` mit Checksummen
   - `search-index.json` für die Suche

2. **Download-Manager**
   - IndexedDB für Bundle-Speicherung
   - Status-Tracking (not-downloaded, outdated, current)
   - Download mit Fortschrittsanzeige

3. **Bundle-Loader**
   - Konvertiert Bundles zu APP_CONTENT Format
   - Lädt aus IndexedDB oder Netzwerk
   - Injiziert Lectures on-demand
   - Mermaid-Diagramm-Konvertierung

4. **Suche**
   - `search-index.json` mit Keywords und Snippets
   - Suche funktioniert auch ohne geladene Inhalte
   - Fallback zu Index wenn Content nicht geladen
