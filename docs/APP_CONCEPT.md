# App Concept

Eine spielerische Lern-App für Universitätsstudiengänge mit Fokus auf Naturwissenschaften.

## Ziel

Studenten können den Lernstoff ihres Studiums strukturiert durcharbeiten, ihr Wissen testen und ihren Fortschritt verfolgen – alles im Browser, ohne Login oder Backend.

## Unterstützte Studiengänge

- **BSc Ernährungswissenschaften** (Universität Wien)
- **BSc Lebensmittel- und Biotechnologie** (BOKU Wien)
- Weitere Studiengänge können einfach hinzugefügt werden

## Kernfunktionen

### 📚 Multi-Study Support

- **Mehrere Studiengänge** in einer App
- Jeder Studiengang hat eigene Module, Vorlesungen und Achievements
- Fortschritt wird pro Studiengang getrennt gespeichert
- Einfacher Wechsel zwischen Studiengängen

### 📖 Module & Vorlesungen

- **Module** entsprechend dem jeweiligen Uni-Curriculum
- Jedes Modul enthält mehrere **Vorlesungen** zu spezifischen Themen
- Vorlesungen bestehen aus **Lernschritten**: Text, Videos, Bilder, Diagramme, Selbsttests

### 🎯 Tests & Bewertung

- **Selbsttests** während der Vorlesung (nicht bewertet, sofortiges Feedback)
- **Quiz** am Ende jeder Vorlesung (bewertet mit 🥇🥈🥉)
- **Modulprüfung** (geplant) – wird freigeschaltet bei 80% Durchschnitt

### 🏆 Fortschritt & Motivation

- **Badges** für Quiz-Leistungen: Gold (≥90%), Silber (≥70%), Bronze (≥50%)
- **Modul-Fortschritt** basierend auf Quiz-Durchschnitt
- **Achievements** für besondere Leistungen mit Cheat-Sheets
- **Training Mode** zum Wiederholen und Token sammeln

## Benutzerfluss

```text
Start → Name eingeben → Studiengang wählen → Modulübersicht
                                                    ↓
                                           Modul auswählen
                                                    ↓
                                          Vorlesungen sehen
                                               ↓         ↓
                                        Vorlesung    Quiz starten
                                         starten          ↓
                                            ↓        Fragen beantworten
                                    Schritte durcharbeiten    ↓
                                            ↓        Ergebnis + Badge
                                    Selbsttests machen        ↓
                                            ↓        Achievement freischalten
                                      Quiz starten →→→→→→↗
```

## Technische Eckpunkte

- **Kein Backend** – läuft komplett im Browser
- **Kein Login** – Fortschritt in localStorage
- **Responsive** – funktioniert auf Desktop und Mobile
- **Dark Mode** – Augen schonen beim Lernen

## Content-Typen

| Typ        | Beschreibung                     |
| ---------- | -------------------------------- |
| Text       | Markdown-formatierte Lerninhalte |
| Video      | Eingebettete YouTube-Videos      |
| Bild       | Illustrationen und Diagramme     |
| Mermaid    | Interaktive Flowcharts           |
| Selbsttest | Multiple-Choice ohne Bewertung   |
| Quiz-Frage | Multiple-Choice mit Bewertung    |

## Umgesetzte Features

- [x] Multi-Study Support (mehrere Studiengänge)
- [x] Fortschritts-Dashboard mit Statistiken
- [x] Fortschritt exportieren/importieren (Backup & Restore)
- [x] Achievement-System mit zeitlich begrenzten Lernhilfen
- [x] Training-Modus mit Token-System für Achievement-Verlängerungen
- [x] Globale Suche über alle Inhalte
- [x] Studienstruktur-Map zur Übersicht
- [x] PWA – installierbar als Offline-App
- [x] Swipe-Gesten für mobile Navigation

## Geplante Features

- [ ] Modulprüfungen (Abschlusstest pro Modul)
- [ ] Modul-Abhängigkeiten (höhere Module erst nach Grundlagen)
