# YouTube-Videos: Atome, Moleküle und Ionen

> **Status:** ✅ Alle Videos oEmbed-verifiziert (12.01.2026)
>
> **Hinweis:** KEINE simpleclub-Videos (Embedding blockiert)

---

## Verifizierte Videos

### 1. Atombau / Subatomare Teilchen

| Eigenschaft  | Wert                                                 |
| ------------ | ---------------------------------------------------- |
| **Titel**    | Protonen, Neutronen und Elektronen - einfach erklärt |
| **Kanal**    | einfach erklärt                                      |
| **URL**      | https://www.youtube.com/watch?v=7kuUxo1xlw0          |
| **Video-ID** | `7kuUxo1xlw0`                                        |
| **oEmbed**   | ✓ verifiziert                                        |

---

### 2. Isotope und Atommasse

| Eigenschaft  | Wert                                        |
| ------------ | ------------------------------------------- |
| **Titel**    | Was sind Isotope? I musstewissen Chemie     |
| **Kanal**    | musstewissen Chemie                         |
| **URL**      | https://www.youtube.com/watch?v=6DqCWFC4o6w |
| **Video-ID** | `6DqCWFC4o6w`                               |
| **oEmbed**   | ✓ verifiziert                               |

---

### 3. Periodensystem Aufbau

| Eigenschaft  | Wert                                                       |
| ------------ | ---------------------------------------------------------- |
| **Titel**    | Periodensystem der Elemente I Teil 1 I musstewissen Chemie |
| **Kanal**    | musstewissen Chemie                                        |
| **URL**      | https://www.youtube.com/watch?v=J2KJRRH0E3Y                |
| **Video-ID** | `J2KJRRH0E3Y`                                              |
| **oEmbed**   | ✓ verifiziert                                              |

---

### 4. Ionenbindung / Salze

| Eigenschaft  | Wert                                               |
| ------------ | -------------------------------------------------- |
| **Titel**    | Ionen und Salze I Einführung I musstewissen Chemie |
| **Kanal**    | musstewissen Chemie                                |
| **URL**      | https://www.youtube.com/watch?v=fTcnELa-v88        |
| **Video-ID** | `fTcnELa-v88`                                      |
| **oEmbed**   | ✓ verifiziert                                      |

---

### 5. Das Mol / Stoffmenge

| Eigenschaft  | Wert                                                        |
| ------------ | ----------------------------------------------------------- |
| **Titel**    | Was sind Teilchenzahl und Stoffmenge? I musstewissen Chemie |
| **Kanal**    | musstewissen Chemie                                         |
| **URL**      | https://www.youtube.com/watch?v=WDXYXykdkMQ                 |
| **Video-ID** | `WDXYXykdkMQ`                                               |
| **oEmbed**   | ✓ verifiziert                                               |

---

## Verwendung in lecture-items

```yaml
---
type: 'youtube-video'
topic: '[Themenblock]'
url: 'https://www.youtube.com/watch?v=[VIDEO_ID]'
title: '[Exakter Titel]'
description: '[Kurze Beschreibung]'
duration: '[Dauer]'
---
```

## oEmbed-Verifizierung

```bash
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=[VIDEO_ID]&format=json"
```

Wenn JSON mit `"title"` zurückkommt → Video existiert und ist einbettbar.
