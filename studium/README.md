# Studium Referenzmaterial

Dieser Ordner enthält **Referenzmaterialien**, die als Grundlage für die Inhalte der Anwendung dienen. Diese Dateien sind **nicht Teil der Anwendung** selbst, sondern Quelldokumente, die von Content-Erstellern bei der Entwicklung von Vorlesungen, Quizzes und anderen Lernmaterialien verwendet werden.

## Zweck

Die Materialien in diesem Ordner:

- Liefern die Struktur des Curriculums und Modulübersicht
- Definieren Lernziele und Themen
- Dienen als autoritative Quellen für inhaltliche Richtigkeit
- Leiten die Entwicklung von Anwendungsinhalten

## Inhalt

### Module_BSc_Ernaehrungswissenschaften.md

Offizielle Übersicht des Bachelorstudiengangs Ernährungswissenschaften, einschließlich:

- Vollständige Liste aller 14 Pflichtmodule
- ECTS-Punkte für jedes Modul
- Alternative Wahlpflichtmodule
- Modulbeschreibungen und Lernziele

Dieses Dokument dient als Master-Curriculum-Referenz bei:

- Erstellung neuer Modulinhalte in der Anwendung
- Überprüfung von Modultiteln und ECTS-Punkten
- Planung von Inhaltsstruktur und Progression
- Sicherstellung der Übereinstimmung mit dem tatsächlichen Studiengang

## Beziehung zum Anwendungsinhalt

```text
studium/                              →  Quelldateien (dieser Ordner)
    Module_BSc_*.md                   →  Curriculum-Referenz

content/                              →  Anwendungsinhalt
    modules.json                      →  Modul-Metadaten (abgeleitet von studium/)
    01-ernaehrungslehre-grundlagen/   →  Tatsächlicher Lerninhalt
        01-grundlagen-zellbiologie/
            lecture.md
            quiz.md
```

**Arbeitsablauf:**

1. Referenzmaterialien in `studium/` definieren, was gelehrt werden soll
2. Content-Ersteller entwickeln interaktive Lernmaterialien in `content/`
3. Die Anwendung rendert den Inhalt aus `content/` für Studierende

## Für Content-Ersteller

Beim Erstellen neuer Inhalte:

1. **Hier beginnen:** Überprüfe das relevante Modul in `Module_BSc_Ernaehrungswissenschaften.md`
2. **Umfang verstehen:** ECTS-Punkte und Modulbeschreibung prüfen
3. **Struktur erstellen:** Vorlesungen und Themen planen
4. **Inhalt entwickeln:** `lecture.md` und `quiz.md` Dateien in `content/` erstellen
5. **Übereinstimmung prüfen:** Sicherstellen, dass der Inhalt mit dem offiziellen Curriculum übereinstimmt

## Für Entwickler

Bei der Arbeit an der Anwendung:

- Diese Dateien werden **nicht von der Anwendung geladen**
- Sie dienen **nur als Referenz** für die Content-Entwicklung
- Die Anwendung liest aus dem `content/` Ordner, nicht aus `studium/`
- Modul-Metadaten in `content/modules.json` sollten mit diesen Referenzen übereinstimmen

## Neue Referenzmaterialien hinzufügen

Beim Hinzufügen neuer Quelldokumente zu diesem Ordner:

1. Datei zu diesem Verzeichnis hinzufügen
2. Dieses README mit einer Beschreibung aktualisieren
3. Sicherstellen, dass Dateinamen beschreibend und konsistent sind
4. Markdown-Format für Textdokumente verwenden

## Hinweise

- Diese Dateien mit dem offiziellen Curriculum synchron halten
- Daten und Versionen bei Curriculum-Änderungen aktualisieren
- Diese Materialien werden getrennt vom Anwendungsinhalt gepflegt
- Sie können Informationen enthalten, die noch nicht in der Anwendung implementiert sind
