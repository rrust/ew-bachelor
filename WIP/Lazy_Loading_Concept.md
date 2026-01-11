# Lazy Loading Concept

## Problem

Die App lädt beim Start **alle** Content-Dateien für den aktiven Studiengang. Bei BSc Ernährungswissenschaften sind das aktuell ~118 Markdown-Dateien. Mit wachsendem Content wird das immer langsamer.

**Aktuelle Ladezeit (geschätzt):**
- Erster Besuch (ohne Cache): 3-8 Sekunden
- Mit Service Worker Cache: 1-2 Sekunden
- Bei 500+ Dateien: Deutlich länger

---

## Lösung: Lazy Loading

Nur die benötigten Inhalte laden, wenn sie gebraucht werden.

### Strategie

| Was | Wann laden | Warum |
|-----|------------|-------|
| `modules.json` | App-Start | Modul-Übersicht für Cards |
| `content-list.json` | App-Start | Wissen welche Dateien existieren |
| Lecture Content | Beim Öffnen der Lecture | Nur wenn User es braucht |
| Quiz Content | Beim Starten des Quiz | Nur wenn User es braucht |
| Achievements | Beim Öffnen der Gallery | Oder beim Unlock-Check |

### Vorteile

- ⚡ **Schneller App-Start** - Nur ~2 kleine JSON-Dateien
- 📱 **Weniger Datenverbrauch** - Nur genutzte Inhalte laden
- 🔄 **Bessere Skalierbarkeit** - Funktioniert auch mit 1000+ Dateien

### Nachteile

- 🔍 **Suche komplizierter** - Kann nicht in ungeladenem Content suchen
- 📴 **Offline-Modus** - Nur geladene Inhalte offline verfügbar
- 🛠️ **Mehr Komplexität** - Loading-States pro Modul/Lecture

---

## Implementierungsplan

### Phase 1: Vorbereitung

1. **Content-Struktur anpassen**
   - Jedes Modul bekommt eine `module-summary.json` mit Metadaten
   - Lectures als einzelne JSON-Dateien (nicht mehr Markdown parsen zur Laufzeit)

2. **Pre-build Step hinzufügen**
   - Script das Markdown → JSON konvertiert
   - Generiert `module-summary.json` pro Modul
   - Läuft bei Content-Änderungen

### Phase 2: Lazy Loading implementieren

1. **ModuleLoader erstellen**
   ```javascript
   // js/module-loader.js
   const ModuleLoader = {
     loaded: {}, // Cache für geladene Module
     
     async loadModule(moduleId) {
       if (this.loaded[moduleId]) return this.loaded[moduleId];
       
       const response = await fetch(`content/${studyId}/${moduleId}/module.json`);
       this.loaded[moduleId] = await response.json();
       return this.loaded[moduleId];
     },
     
     async loadLecture(moduleId, lectureId) {
       const module = await this.loadModule(moduleId);
       return module.lectures[lectureId];
     }
   };
   ```

2. **UI Loading States**
   - Skeleton/Placeholder beim Laden
   - "Inhalt wird geladen..." Anzeige
   - Fehlerbehandlung wenn Laden fehlschlägt

3. **Suche anpassen**
   - Option A: Nur in geladenen Inhalten suchen
   - Option B: Separater Suchindex (search-index.json)
   - Option C: Suche lädt Module bei Bedarf nach

### Phase 3: Offline-Modus

1. **Selective Caching**
   - User kann Module "herunterladen" für Offline
   - Button "Für Offline speichern" pro Modul
   - Anzeige welche Module offline verfügbar sind

2. **Service Worker erweitern**
   - Dynamisches Caching von Modul-Content
   - Offline-Indicator in der UI

---

## Dateistruktur (Vorschlag)

```
content/bsc-ernaehrungswissenschaften/
├── modules.json              # Modul-Metadaten (klein, lädt beim Start)
├── content-list.json         # Dateiliste (klein, lädt beim Start)  
├── search-index.json         # Optional: Suchindex für alle Inhalte
└── 01-ernaehrungslehre/
    ├── module.json           # Komplett kompiliertes Modul (lazy load)
    │   └── { lectures: {...}, achievements: {...} }
    └── [original .md files]  # Source files, nicht mehr zur Laufzeit geladen
```

---

## Aufwand

| Phase | Geschätzter Aufwand | Priorität |
|-------|---------------------|-----------|
| Phase 1: Vorbereitung | 2-3 Tage | Hoch |
| Phase 2: Lazy Loading | 3-5 Tage | Hoch |
| Phase 3: Offline-Modus | 2-3 Tage | Mittel |

**Gesamt: ~1-2 Wochen**

---

## Alternativen

### Option: Bundled Content

Statt Lazy Loading alle Inhalte in eine große JSON-Datei bündeln:

```
content/bsc-ernaehrungswissenschaften/bundle.json
```

**Vorteile:**
- Nur 1 HTTP Request statt 118
- Einfacher zu implementieren
- Gute Kompression (gzip)

**Nachteile:**
- Immer alles laden
- Große Datei bei viel Content
- Jede Änderung invalidiert gesamten Cache

### Empfehlung

**Kurzfristig:** Bundled Content (einfacher, schneller Gewinn)
**Langfristig:** Lazy Loading (skaliert besser)

---

## Status

- [ ] Konzept reviewed
- [ ] Entscheidung: Bundled vs. Lazy Loading
- [ ] Phase 1 implementiert
- [ ] Phase 2 implementiert
- [ ] Phase 3 implementiert
