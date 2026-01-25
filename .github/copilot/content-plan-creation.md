# Content Plan Creation

Erstellung von CONTENT_PLAN.md Dateien.

## Was ist ein CONTENT_PLAN?

Der CONTENT_PLAN definiert **exakt** welche Dateien für eine Vorlesung erstellt werden:

- Dateinamen (mit Nummerierung)
- Content-Types
- Didaktische Reihenfolge
- Video-Platzierung

## CONTENT_PLAN Format

```markdown
# CONTENT_PLAN: [Vorlesungstitel]

## Status

| Schritt            | Status | Datum | Details |
| ------------------ | ------ | ----- | ------- |
| Content generiert  | ⏳      | -     | -       |
| Videos verifiziert | ⏳      | -     | -       |
| Audio generiert    | ⏳      | -     | -       |
| PR gemerged        | ⏳      | -     | -       |

## Abschnitt 1: [Thema]

| Nr  | Dateiname                 | Typ                | Beschreibung         |
| --- | ------------------------- | ------------------ | -------------------- |
| 01  | 01-learning-einleitung.md | learning-content   | Einführung ins Thema |
| 02  | 02-mc-grundbegriffe.md    | self-assessment-mc | Verständnis-Check    |
| 03  | 03-video-erklaerung.md    | youtube-video      | Video: [Titel]       |

## Abschnitt 2: [Thema]

| Nr  | Dateiname                  | Typ              | Beschreibung |
| --- | -------------------------- | ---------------- | ------------ |
| 04  | 04-learning-konzept.md     | learning-content | Hauptkonzept |
| 05  | 05-matching-begriffe.md    | matching         | Zuordnung    |
| 06  | 06-calculation-beispiel.md | calculation      | Berechnung   |

[...]

## Vorlesungs-Abschluss

| Nr  | Dateiname             | Typ             | Beschreibung             |
| --- | --------------------- | --------------- | ------------------------ |
| 45  | 45-self-assessment.md | self-assessment | Bereitschafts-Checkliste |

## Quiz (questions/)

| Nr  | Dateiname           | Typ                      |
| --- | ------------------- | ------------------------ |
| 01  | 01-frage-thema-a.md | multiple-choice-multiple |
| 02  | 02-frage-thema-b.md | multiple-choice-multiple |
[12 Fragen total]
```

## V4-Schema: Lernen → Überprüfen → Anwenden

Jeder Abschnitt folgt diesem Muster:

```text
📚 LERNEN
   └── learning-content (Theorie, Konzepte, Formeln)

✅ ÜBERPRÜFEN (direkt danach!)
   ├── self-assessment-mc (einfache MC)
   ├── fill-in-the-blank (Lückentexte)
   ├── matching (Zuordnung)
   └── ordering (Sortierung)

🧮 ANWENDEN
   ├── practice-exercise (Alltagsszenarien)
   └── calculation (Berechnungen)

📺 VIDEO
   └── youtube-video (an thematisch passender Stelle)
```

⚠️ **Videos gehören zum jeweiligen Abschnitt, NICHT ans Ende gesammelt!**

## Vorlesungs-Abschluss

Am Ende jeder Vorlesung:

1. **self-assessment** – Checkliste "Bin ich bereit?"
2. **questions/** – 12 schwere `multiple-choice-multiple` Fragen
3. **module-exam/** – 2 sehr schwierige Transferfragen (optional)

## Checkliste für CONTENT_PLAN

- [ ] Status-Tabelle am Anfang (nach Titel)
- [ ] Jeder Abschnitt hat learning-content VOR den Checks
- [ ] Verständnis-Checks DIREKT nach dem Lerninhalt
- [ ] Videos thematisch platziert (nicht am Ende)
- [ ] Durchgehende Nummerierung (01, 02, 03...)
- [ ] Dateinamen beschreibend und konsistent
- [ ] 12 Quiz-Fragen in questions/
- [ ] Abschluss-Checkliste vorhanden

## Beispiel: Vollständiger CONTENT_PLAN

```markdown
# CONTENT_PLAN: Ionenbindung und Kristallstrukturen

## Status

| Schritt            | Status | Datum | Details |
| ------------------ | ------ | ----- | ------- |
| Content generiert  | ⏳      | -     | -       |
| Videos verifiziert | ⏳      | -     | -       |
| Audio generiert    | ⏳      | -     | -       |
| PR gemerged        | ⏳      | -     | -       |

## Abschnitt 1: Grundlagen der Ionenbindung

| Nr  | Dateiname                      | Typ                | Beschreibung                 |
| --- | ------------------------------ | ------------------ | ---------------------------- |
| 01  | 01-learning-ionenbindung.md    | learning-content   | Was ist Ionenbindung?        |
| 02  | 02-mc-elektronenübertragung.md | self-assessment-mc | Check: Elektronenübertragung |
| 03  | 03-video-ionenbindung.md       | youtube-video      | Video: Chemie simpleclub     |

## Abschnitt 2: Gitterenergie

| Nr  | Dateiname                       | Typ               | Beschreibung         |
| --- | ------------------------------- | ----------------- | -------------------- |
| 04  | 04-learning-gitterenergie.md    | learning-content  | Born-Landé-Gleichung |
| 05  | 05-fill-gitterenergie.md        | fill-in-the-blank | Lückentext: Formel   |
| 06  | 06-calculation-gitterenergie.md | calculation       | Berechnung NaCl      |

## Abschnitt 3: Kristallstrukturen

| Nr  | Dateiname                 | Typ              | Beschreibung                   |
| --- | ------------------------- | ---------------- | ------------------------------ |
| 07  | 07-learning-strukturen.md | learning-content | Kristallgitter-Typen           |
| 08  | 08-matching-strukturen.md | matching         | Zuordnung: Struktur → Beispiel |
| 09  | 09-video-kristalle.md     | youtube-video    | Video: Kristallographie        |

## Vorlesungs-Abschluss

| Nr  | Dateiname             | Typ             | Beschreibung        |
| --- | --------------------- | --------------- | ------------------- |
| 10  | 10-self-assessment.md | self-assessment | Bereitschafts-Check |

## Quiz (questions/)

| Nr  | Dateiname                     | Typ                      |
| --- | ----------------------------- | ------------------------ |
| 01  | 01-ionenbindung-entstehung.md | multiple-choice-multiple |
| 02  | 02-gitterenergie-faktoren.md  | multiple-choice-multiple |
| 03  | 03-kristallstrukturen.md      | multiple-choice-multiple |
[... 12 Fragen total]

## Status

| Schritt            | Status | Datum | Details |
| ------------------ | ------ | ----- | ------- |
| Content generiert  | ⏳      | -     | -       |
| Videos verifiziert | ⏳      | -     | -       |
| Audio generiert    | ⏳      | -     | -       |
| PR gemerged        | ⏳      | -     | -       |
```

## Videos aus Videos.md einplanen

## Videos im CONTENT_PLAN

Videos werden als Platzhalter eingeplant. Der Copilot-Agent findet automatisch passende YouTube-URLs während der Generierung (Schritt 3).

**Falls `Videos.md` im Material-Ordner existiert:**
1. Videos durchlesen und Thema verstehen
2. Im CONTENT_PLAN an passender Stelle einfügen
3. Nur verifizierte Videos (oEmbed ✓) verwenden

**Falls keine `Videos.md` existiert:**
Video-Platzhalter mit Themenbeschreibung einfügen – URLs werden automatisch gefunden.

```markdown
## Abschnitt 2: Gitterenergie

| Nr  | Dateiname                       | Typ              | Beschreibung                 |
| --- | ------------------------------- | ---------------- | ---------------------------- |
| 04  | 04-learning-gitterenergie.md    | learning-content | Born-Landé-Gleichung         |
| 05  | 05-video-gitterenergie.md       | youtube-video    | Video: Gitterenergie erklärt |
| 06  | 06-calculation-gitterenergie.md | calculation      | Übung zur Berechnung         |
```

> **Hinweis:** Der Copilot-Agent verifiziert alle Videos automatisch mit `npm run validate:videos`. Nur bei ungültigen Videos wird der Gemini-Fallback benötigt.

## Status-Update nach Generierung

Nach Abschluss der Content-Generierung wird der Status im CONTENT_PLAN aktualisiert:

```markdown
## Status

| Schritt            | Status | Datum      | Details             |
| ------------------ | ------ | ---------- | ------------------- |
| Content generiert  | ✅      | 2026-01-25 | 37 Items, 12 Fragen |
| Videos verifiziert | ✅      | 2026-01-25 | 3/4 funktionieren   |
| Audio generiert    | ✅      | 2026-01-25 | 16 MP3s             |
| PR gemerged        | ✅      | 2026-01-25 | PR #123             |
```

**Status-Symbole:**

| Symbol | Bedeutung                   |
| ------ | --------------------------- |
| ⏳      | Ausstehend                  |
| ✅      | Abgeschlossen               |
| ❌      | Fehlgeschlagen/Übersprungen |
| 🔄      | In Bearbeitung              |
