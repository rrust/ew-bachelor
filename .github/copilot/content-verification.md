# Content Verification

Vollständigkeits- und Qualitätsprüfung von Lerninhalten.

## Überblick: 4 Prüfungskategorien

| Kategorie           | Fokus                  | Werkzeuge             |
| ------------------- | ---------------------- | --------------------- |
| **Vollständigkeit** | Haben wir alles?       | Checklisten, Scripts  |
| **Funktionalität**  | Funktioniert alles?    | oEmbed, Browser-Tests |
| **Qualität**        | Stimmt der Inhalt?     | Manuelle Review       |
| **Konsistenz**      | Ist alles einheitlich? | Validierungs-Scripts  |

## 1. Vollständigkeitsprüfung

### Vorlesungs-Checkliste

Für jede Vorlesung müssen vorhanden sein:

```text
content/{studyId}/NN-modul/NN-vorlesung/
├── lecture.md                    ✓ Metadaten
├── lecture-items/
│   ├── NN-learning-*.md          ✓ Learning-Content Items
│   ├── NN-mc-*.md                ✓ Self-Assessment MCs
│   ├── NN-matching-*.md          ✓ Matching-Aufgaben
│   ├── NN-calculation-*.md       ✓ Berechnungen (falls im Plan)
│   ├── NN-youtube-*.md           ✓ Videos
│   └── NN-self-assessment.md     ✓ Bereitschafts-Checkliste
└── questions/
    └── 01-12-*.md                ✓ 12 Quiz-Fragen
```

### Modul-Checkliste

```text
content/{studyId}/NN-modul/
├── module.md                     ✓ Modul-Metadaten
├── achievements/
│   └── NN-*-cheatsheet.md        ✓ Ein Achievement pro Vorlesung
├── module-training/              ✓ Trainings-Fragen (falls vorhanden)
└── NN-vorlesung/                 ✓ Alle Vorlesungen
```

### Schnell-Check mit Scripts

```bash
# Alle Vorlesungen eines Moduls prüfen
ls -la content/{studyId}/NN-modul/*/lecture.md

# Alle Achievements zählen
ls content/{studyId}/NN-modul/achievements/ | wc -l

# Alle Questions zählen
find content/{studyId}/NN-modul/*/questions -name "*.md" | wc -l

# Audio-Dateien prüfen
find content/{studyId}/NN-modul/*/lecture-items -name "*.mp3" | wc -l
find content/{studyId}/NN-modul/*/lecture-items -name "*.audio.txt" | wc -l
```

### Vollständigkeits-Matrix

| Komponente         | Erwartete Anzahl       | Prüfbefehl                             |
| ------------------ | ---------------------- | -------------------------------------- |
| lecture.md         | 1 pro Vorlesung        | `ls */lecture.md`                      |
| learning-content   | gemäß CONTENT_PLAN     | `grep -l "type: 'learning-content'"`   |
| self-assessment-mc | gemäß CONTENT_PLAN     | `grep -l "type: 'self-assessment-mc'"` |
| youtube-video      | gemäß CONTENT_PLAN     | `grep -l "type: 'youtube-video'"`      |
| questions          | 12 pro Vorlesung       | `ls questions/*.md \| wc -l`           |
| achievement        | 1 pro Vorlesung        | `ls achievements/*.md`                 |
| audio.txt          | 1 pro learning-content | `ls *.audio.txt \| wc -l`              |
| mp3                | 1 pro learning-content | `ls *.mp3 \| wc -l`                    |

## 2. Funktionalitätsprüfung

### YouTube-Video-Verifizierung

```bash
# Alle Videos im Studium prüfen
npm run validate:videos

# Spezifisches Studium
node scripts/validate-videos.js bsc-ernaehrungswissenschaften
```

**Ergebnis-Interpretation:**

| Status | Bedeutung                     | Aktion             |
| ------ | ----------------------------- | ------------------ |
| ✅      | oEmbed HTTP 200, Embedding OK | Behalten           |
| ❌      | HTTP 401/403/404              | Video ersetzen     |
| ⚠️      | simpleclub im author_name     | Im Browser testen! |

### Manuelle Video-Prüfung

Falls das Script nicht ausreicht:

```bash
# Einzelnes Video manuell prüfen
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json" | jq
```

**Erwartete Response:**

```json
{
  "title": "Video Titel",
  "author_name": "Kanal Name",
  "type": "video",
  "html": "<iframe..."
}
```

### Content-Struktur validieren

```bash
# YAML-Syntax und Pflichtfelder prüfen
npm run validate:content

# Markdown-Syntax prüfen
npx markdownlint-cli2 "content/**/*.md"
```

### Browser-Tests

Im Browser unter **Tools → Inhalte validieren**:

- [ ] Alle Vorlesungen laden ohne Fehler
- [ ] Quiz-Fragen haben korrekte Antworten
- [ ] Videos werden eingebettet (nicht nur Link)
- [ ] Audio-Player erscheint bei learning-content
- [ ] Achievement wird bei Gold-Status freigeschaltet
- [ ] Keine Console-Fehler (F12 → Console)

### Links prüfen

```bash
# Externe Links in Content suchen
grep -rh "http" content/{path}/**/*.md | grep -v "youtube.com" | grep -v "moodle.univie"
```

## 3. Qualitätsprüfung (Inhaltlich)

### Learning-Content Review

| Kriterium            | Prüffrage                                                      |
| -------------------- | -------------------------------------------------------------- |
| **Korrektheit**      | Sind alle Fakten, Formeln und Definitionen korrekt?            |
| **Vollständigkeit**  | Werden alle Konzepte aus Vorlesung.md abgedeckt?               |
| **Verständlichkeit** | Ist die Erklärung für Studierende im 1. Semester verständlich? |
| **Struktur**         | Gibt es klare Überschriften, Tabellen, Listen?                 |
| **Formeln**          | Sind KaTeX-Formeln korrekt gerendert?                          |
| **Länge**            | Nicht zu lang (max. 5-7 Minuten Lesezeit pro Item)?            |

### Quiz-Fragen Review

| Kriterium              | Prüffrage                                              |
| ---------------------- | ------------------------------------------------------ |
| **Eindeutigkeit**      | Ist die richtige Antwort eindeutig?                    |
| **Schwierigkeit**      | Angemessen für Vorlesungstest?                         |
| **Distraktoren**       | Sind falsche Antworten plausibel?                      |
| **Erklärung**          | Erklärt die Explanation warum die Antwort richtig ist? |
| **Antwort-Verteilung** | Sind nicht alle korrekten Antworten gleich lang?       |

### Self-Assessment-MC Review

| Kriterium             | Prüffrage                                  |
| --------------------- | ------------------------------------------ |
| **Bezug zum Content** | Prüft die Frage das direkt davor Gelernte? |
| **Schwierigkeit**     | Einfacher als Quiz-Fragen?                 |
| **Lerneffekt**        | Hilft die Explanation beim Verstehen?      |

### Video Review

| Kriterium               | Prüffrage                             |
| ----------------------- | ------------------------------------- |
| **Thematische Passung** | Erklärt das Video das richtige Thema? |
| **Qualität**            | Gute Audio/Video-Qualität?            |
| **Länge**               | Angemessen (5-15 Minuten ideal)?      |
| **Sprache**             | Deutsch?                              |
| **Aktualität**          | Nicht veraltet?                       |

### Achievement Review

| Kriterium        | Prüffrage                             |
| ---------------- | ------------------------------------- |
| **Kompaktheit**  | Ist das Cheat-Sheet wirklich kompakt? |
| **Nützlichkeit** | Hilft es beim schnellen Nachschlagen? |
| **Korrektheit**  | Stimmen Formeln und Fakten?           |
| **Mobile**       | Keine zu breiten Tabellen?            |

## 4. Konsistenzprüfung

### Namenskonventionen

| Element        | Konvention             | Beispiel                      |
| -------------- | ---------------------- | ----------------------------- |
| Ordner         | lowercase, kebab-case  | `01-materie-messen`           |
| Dateien        | NN-typ-beschreibung.md | `03-learning-ionenbindung.md` |
| Achievement-ID | lowercase, kebab-case  | `materie-messen-cheatsheet`   |
| lectureId      | = Ordnername           | `01-materie-messen`           |
| moduleId       | = Ordnername           | `02-chemie-grundlagen`        |

### Cross-Referenzen prüfen

```bash
# Achievement lectureId/moduleId prüfen
grep -r "lectureId:" content/*/achievements/*.md
grep -r "moduleId:" content/*/achievements/*.md

# Vergleichen mit tatsächlichen Ordnernamen
ls -d content/*/*/*/
```

### Versionierung prüfen

```bash
# Alle lecture.md Versionen anzeigen
grep -r "version:" content/*/*/lecture.md
```

## Verifikations-Workflow

### Nach Content-Generierung

```bash
# 1. Build
npm run build

# 2. Content validieren
npm run validate:content

# 3. Videos validieren  
npm run validate:videos

# 4. Markdown linten
npx markdownlint-cli2 "content/{path}/**/*.md"

# 5. Testdaten regenerieren
node scripts/generate-test-progress.js

# 6. Im Browser testen
# → Tools → Inhalte validieren
```

### Vor Git Commit

- [ ] Alle Validierungs-Scripts laufen ohne Fehler
- [ ] Videos mit oEmbed verifiziert
- [ ] Im Browser getestet
- [ ] Keine Console-Fehler
- [ ] CONTENT_PLAN vollständig umgesetzt
- [ ] Achievement vorhanden
- [ ] Audio-Dateien (falls generiert) funktionieren

## Fehlerbehebung

### Häufige Probleme

| Problem                          | Ursache                   | Lösung                        |
| -------------------------------- | ------------------------- | ----------------------------- |
| `correctAnswer not in options`   | Tippfehler bei Antwort    | Exakt gleichen Text verwenden |
| Video lädt nicht                 | oEmbed fehlgeschlagen     | Video ersetzen                |
| Audio-Player fehlt               | Build nicht ausgeführt    | `npm run build`               |
| Achievement nicht freigeschaltet | lectureId/moduleId falsch | IDs = Ordnernamen             |
| KaTeX rendert nicht              | Fehlerhafte Formel-Syntax | Formel-Syntax prüfen          |

### Debug-Befehle

```bash
# Content-Fehler im Detail
npm run validate:content 2>&1 | grep -A2 "Error"

# Video-URLs extrahieren
grep -rh "url:" content/**/*youtube*.md

# Fehlende Achievements finden
for dir in content/*/*/; do
  lecture=$(basename "$dir")
  if [[ ! -f "${dir%/}/../achievements/${lecture}-cheatsheet.md" ]]; then
    echo "Missing: ${lecture}"
  fi
done
```

## Checkliste: Vollständige Vorlesung

```text
[ ] lecture.md mit korrekten Metadaten
[ ] Alle lecture-items gemäß CONTENT_PLAN
[ ] 12 Quiz-Fragen in questions/
[ ] Self-assessment am Ende
[ ] Videos mit oEmbed verifiziert
[ ] Achievement erstellt
[ ] Audio-Scripts erstellt
[ ] MP3-Dateien generiert
[ ] npm run build erfolgreich
[ ] npm run validate:content ohne Fehler
[ ] npm run validate:videos alle ✅
[ ] markdownlint ohne Fehler
[ ] Browser-Test bestanden
```

## Siehe auch

- [content-generation.md](content-generation.md) – Generierungs-Workflow
- [validation.md](validation.md) – Validierungs-Befehle
- [video-workflow.md](video-workflow.md) – Video-Ersatz mit Gemini
