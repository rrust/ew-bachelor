# App Concept

Eine spielerische Lern-App für das Bachelorstudium Ernährungswissenschaften.

## Ziel

Studenten können den Lernstoff ihres Studiums strukturiert durcharbeiten, ihr Wissen testen und ihren Fortschritt verfolgen – alles im Browser, ohne Login oder Backend.

## Kernfunktionen

### 📚 Module & Vorlesungen

- **14 Module** entsprechend dem Uni-Curriculum
- Jedes Modul enthält mehrere **Vorlesungen** zu spezifischen Themen
- Vorlesungen bestehen aus **Lernschritten**: Text, Videos, Bilder, Diagramme, Selbsttests

### 🎯 Tests & Bewertung

- **Selbsttests** während der Vorlesung (nicht bewertet, sofortiges Feedback)
- **Quiz** am Ende jeder Vorlesung (bewertet mit 🥇🥈🥉)
- **Modulprüfung** (geplant) – wird freigeschaltet bei 80% Durchschnitt

### 🏆 Fortschritt & Motivation

- **Badges** für Quiz-Leistungen: Gold (≥90%), Silber (≥70%), Bronze (≥50%)
- **Modul-Fortschritt** basierend auf Quiz-Durchschnitt
- **Achievements** für besondere Leistungen (geplant)

## Benutzerfluss

```text
Start → Name eingeben → Modulübersicht
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
              Selbsttests machen
                      ↓
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

## Geplante Features

- [ ] Modulprüfungen (Abschlusstest pro Modul)
- [ ] Modul-Abhängigkeiten (höhere Module erst nach Grundlagen)
- [ ] Fortschritts-Dashboard mit Statistiken
- [ ] Fortschritt exportieren/importieren
- [ ] Achievement-System
