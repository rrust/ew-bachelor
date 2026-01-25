# Video Workflow

YouTube-Videos für Lerninhalte finden und verifizieren.

## Problem: Videos funktionieren nicht

Wenn YouTube-Videos in der App nicht laden, liegt es meist an:

1. **Video gelöscht** – URL existiert nicht mehr
2. **Embedding deaktiviert** – Kanal blockiert externe Einbettung
3. **Geo-Blocking** – Video in AT/DE nicht verfügbar

## Kanal-Listen

### ✅ Whitelist (Embedding funktioniert)

| Kanal               | oEmbed author_name  | Anmerkung         |
| ------------------- | ------------------- | ----------------- |
| Die Merkhilfe       | Die Merkhilfe       | Gute Qualität     |
| Lehrerschmidt       | Lehrerschmidt       | Sehr verständlich |
| Musstewissen Chemie | musstewissen Chemie | funk-Format       |
| Chemie-ist-cool     | Chemie-ist-cool     | Uni-Niveau        |
| StudyTiger          | StudyTiger          | Gute Erklärungen  |

### ❌ Blacklist (Embedding blockiert)

| Kanal      | oEmbed author_name    | Problem                                   |
| ---------- | --------------------- | ----------------------------------------- |
| simpleclub | Chemie - simpleclub   | **Blockiert Embedding** trotz oEmbed 200! |
| simpleclub | Biologie - simpleclub | **Blockiert Embedding**                   |
| simpleclub | Physik - simpleclub   | **Blockiert Embedding**                   |

> **Wichtig:** simpleclub-Videos geben HTTP 200 bei oEmbed zurück, blockieren aber trotzdem das Embedding im iframe! Der `author_name` muss geprüft werden.

## Lösung: Gemini für Video-Suche verwenden

**Wichtig:** Claude und andere LLMs sind für diese Aufgabe nicht geeignet – sie können keine Live-API-Calls durchführen. **Gemini** ist die beste Wahl, da es oEmbed-Verifizierung direkt ausführen kann.

### Gemini-Prompt Template

Ersetze `[THEMA]` und `[THEMEN-LISTE]` mit den spezifischen Inhalten:

```text
Ich brauche deutsche YouTube-Videos für eine universitäre Chemie-Vorlesung zum Thema "[THEMA]".

Zielgruppe: Studierende im 1. Semester Ernährungswissenschaften (Universität Wien)

Benötigte Themen:

[THEMEN-LISTE]
Beispiel:
1. Le Chatelier Prinzip - Wie chemische Gleichgewichte auf Störungen reagieren
2. Pufferlösungen Grundlagen - Was ist ein Puffer, Henderson-Hasselbalch-Gleichung
3. Titration - Titrationskurve, Äquivalenzpunkt

Anforderungen:
- Sprache: Deutsch
- Länge: idealerweise 5-15 Minuten
- Qualität: Gute Erklärungen, nicht nur Vorlesungsmitschnitte

BLACKLIST - Diese Kanäle NICHT verwenden (blockieren Embedding):
- simpleclub (author_name enthält "simpleclub")
- Chemie - simpleclub
- Biologie - simpleclub
- Physik - simpleclub

Bevorzugte Kanäle (Whitelist):
- Lehrerschmidt
- Die Merkhilfe
- musstewissen Chemie
- StudyTiger
- Chemie-ist-cool

---

KRITISCH: oEmbed-Verifizierung

Für jedes Video MUSS die Einbettbarkeit geprüft werden!

Prüfmethode: Rufe für jede Video-URL folgende API auf (ersetze VIDEO_ID durch die tatsächliche ID):

https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json

Auswertung:
- HTTP 200 + JSON mit "title" und "author_name" = Video verwendbar
- HTTP 401/403/404 oder Fehler = Video NICHT verwendbar (Embedding blockiert oder Video gelöscht)
- WICHTIG: Prüfe author_name auf "simpleclub" - wenn enthalten, Video ABLEHNEN!

Nur Videos mit erfolgreicher oEmbed-Prüfung im Output auflisten!

---

WICHTIG: Ausgabeformat

Gib die Ergebnisse als einen einzigen, klar formatierten YAML-Codeblock aus, den ich direkt kopieren kann.
Keine zusätzlichen Erklärungen zwischen den Einträgen - nur der reine YAML-Block.

Output-Format (als kopierbarer Codeblock):

- thema: "1. [Thema]"
  titel: "[Videotitel aus oEmbed-Response]"
  url: "https://www.youtube.com/watch?v=..."
  kanal: "[author_name aus oEmbed-Response]"
  oembed_verified: true
  beschreibung: "[1 Satz was das Video erklärt]"

Falls für ein Thema kein verifizierbares Video gefunden wird:

- thema: "X. [Thema]"
  status: "Kein geeignetes Video mit aktivierter Einbettung gefunden"
```

### Wichtige Hinweise zum Prompt

**Gemini muss die oEmbed-API tatsächlich aufrufen!** Falls Gemini Videos vorschlägt die HTTP 404 zurückgeben, hat Gemini die URLs erfunden statt echte Videos zu finden.

In diesem Fall:
1. Gemini explizit darauf hinweisen, dass die URLs nicht existieren
2. Gemini bitten, die oEmbed-API für jedes Video live aufzurufen
3. Falls Gemini weiterhin ungültige URLs liefert: Videos manuell auf YouTube suchen

## Nach Erhalt der Videos

### 1. URLs in Content eintragen

```yaml
---
type: 'youtube-video'
url: 'https://www.youtube.com/watch?v=VIDEO_ID'
---

Kurze Beschreibung des Videos.
```

### 2. Build ausführen

```bash
npm run build
```

### 3. Im Browser testen

Video sollte jetzt in der App laden.

## Manuelle oEmbed-Prüfung

Falls du selbst prüfen möchtest:

```bash
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json"
```

| Ergebnis         | Bedeutung          |
| ---------------- | ------------------ |
| HTTP 200 + JSON  | ✅ Video verwendbar |
| HTTP 401/403/404 | ❌ NICHT verwenden  |

## Bekannte Probleme

| Kanal       | Problem                          |
| ----------- | -------------------------------- |
| simpleclub  | Embedding oft blockiert          |
| Uni-Kanäle  | Häufig Geo-Blocking              |
| Alte Videos | Können jederzeit gelöscht werden |

## Batch-Validierung aller Videos

```bash
node scripts/validate-videos.js
```

Prüft alle `youtube-video` Items und meldet defekte URLs.
