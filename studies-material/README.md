# Studies-Material - Quelldokumente & Referenzmaterial

Dieser Ordner enthält **Quelldokumente und Referenzmaterial** für die Studiengänge (Vorlesungsnotizen, Skripte, Content-Pläne).

> **Hinweis:** Die strukturierten App-Daten befinden sich in `content/` (inkl. `studies.json`).

## Ordnerstruktur

```text
studies-material/
├── README.md                          # Diese Datei
└── {study-id}/                        # Pro Studiengang ein Ordner
    └── NN-modul-name/                 # Quelldokumente/Notizen
        ├── 00-uebersicht.md           # Modul-Übersicht, Prüfungsinfos
        ├── 01-kapitel-name.md         # Vorlesungsmitschriften, Skripte
        └── Content-Plan.md            # Plan für App-Content-Generierung
```

## Beziehung zu content/

| Ordner/Datei                | Zweck                                     |
| --------------------------- | ----------------------------------------- |
| `content/studies.json`      | Master-Liste aller Studiengänge (für App) |
| `content/{study-id}/`       | Strukturierte App-Lerninhalte             |
| `studies-material/{study-id}/` | Unstrukturierte Quelldokumente/Notizen |

## Workflow: Quelldokumente → App-Inhalte

```text
studies-material/{study-id}/NN-modul/XX-kapitel.md  →  content/{study-id}/NN-modul/XX-lecture/
                    (Rohmaterial)                              (App-Lerninhalte)
```

1. **Quelldokumente erstellen** - Vorlesungsmitschriften, Skripte in `studies-material/`
2. **Content-Plan erstellen** - Was soll in die App? (`Content-Plan.md`)
3. **App-Inhalte generieren** - Lecture-Items, Quiz-Fragen in `content/{study-id}/`

## Content-Erstellung

Für die AI-gestützte Content-Erstellung siehe:
**[docs/AI-Content-Creation-Setup.md](../docs/AI-Content-Creation-Setup.md)**

## Verfügbare Studiengänge

| Studiengang                          | ID                                | Status  |
| ------------------------------------ | --------------------------------- | ------- |
| BSc Ernährungswissenschaften         | `bsc-ernaehrungswissenschaften`   | ✅ Aktiv |
| BSc Lebensmittel- und Biotechnologie | `bsc-lebensmittel-biotechnologie` | ✅ Aktiv |
