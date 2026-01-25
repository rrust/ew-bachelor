# Validation

Alle Validierungen und Qualitätsprüfungen.

## Validierungs-Befehle

| Befehl                                   | Zweck                       |
| ---------------------------------------- | --------------------------- |
| `npm run build`                          | JSON-Dateien regenerieren   |
| `npm run validate:content`               | Content-Struktur prüfen     |
| `npm run validate:videos`                | YouTube-Videos prüfen       |
| `npm run validate:views`                 | View-Vollständigkeit prüfen |
| `npx markdownlint-cli2 "**/*.md"`        | Markdown-Syntax prüfen      |
| `node scripts/generate-test-progress.js` | Testdaten regenerieren      |

⚠️ **NIEMALS `--fix` bei markdownlint verwenden!**

## Wann was ausführen?

### Nach Content-Änderungen

```bash
npm run build                              # JSON regenerieren
npm run validate:content                   # Fehler prüfen
npx markdownlint-cli2 "content/**/*.md"    # Markdown linten
node scripts/generate-test-progress.js    # Testdaten aktualisieren
```

### Nach App-Änderungen

```bash
npm run validate:views                     # Views vollständig?
```

### Im Browser

**Tools → "Inhalte validieren"** – Finale Prüfung

## YouTube-Video-Verifizierung

### Batch-Validierung

```bash
npm run validate:videos
# oder für spezifisches Studium:
node scripts/validate-videos.js bsc-ernaehrungswissenschaften
```

### Manuelle Prüfung

Jede Video-URL MUSS vor Verwendung geprüft werden:

```bash
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json"
```

| Ergebnis                                   | Bedeutung         |
| ------------------------------------------ | ----------------- |
| HTTP 200 + JSON mit `title`, `author_name` | ✅ Video verfügbar |
| HTTP 401/403/404                           | ❌ NICHT verwenden |

**Bekannte Probleme:**

- simpleclub Videos → Embedding oft blockiert
- Alte Videos → Können gelöscht sein
- Geo-Blocking → In AT/DE prüfen

## Häufige Validierungsfehler

### Content-Fehler

| Fehler                         | Ursache       | Lösung                        |
| ------------------------------ | ------------- | ----------------------------- |
| `correctAnswer not in options` | Tippfehler    | Exakt gleichen Text verwenden |
| `Unknown content type`         | Falscher Typ  | Siehe content-types.md        |
| `Missing required field`       | Feld fehlt    | YAML-Template prüfen          |
| `Invalid YAML`                 | Syntax-Fehler | Einrückung prüfen             |

### Markdown-Fehler

| Fehler  | Ursache              | Lösung                              |
| ------- | -------------------- | ----------------------------------- |
| `MD009` | Trailing spaces      | Leerzeichen am Zeilenende entfernen |
| `MD012` | Multiple blank lines | Nur eine Leerzeile                  |
| `MD022` | Heading spacing      | Leerzeile vor Überschrift           |
| `MD032` | List spacing         | Leerzeile um Listen                 |

## Checkliste vor Commit

- [ ] `npm run build` erfolgreich
- [ ] `npm run validate:content` ohne Fehler
- [ ] `npx markdownlint-cli2` ohne Fehler
- [ ] Im Browser getestet (Tools → Validieren)
- [ ] Keine Console-Fehler im Browser
- [ ] YouTube-Videos mit oEmbed verifiziert

## View-Validierung

Bei neuen Views in der App:

1. `index.html` – `<div id="newview-view">` hinzufügen
2. `app.js` – In `views` Objekt aufnehmen
3. `js/router.js` – Route-Parsing hinzufügen
4. `app.js` – `navigateFromURL()` Handler
5. `app.js` – `reinjectHeaders()` aktualisieren
6. `sw.js` – Neue JS-Dateien cachen

```bash
npm run validate:views  # Prüft Vollständigkeit
```

## Testdaten

Nach Content-Änderungen Testdaten aktualisieren:

```bash
node scripts/generate-test-progress.js
```

Dies regeneriert `test-data/` für konsistente Tests.
