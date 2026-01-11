# Studies-Material - Quelldokumente & Referenzmaterial

Dieser Ordner enthält **Quelldokumente und Referenzmaterial** für die Studiengänge (Vorlesungsnotizen, Skripte, Content-Pläne).

> **Hinweis:** Die strukturierten App-Daten befinden sich in `content/` (inkl. `studies.json`).

## Ordnerstruktur

```text
studies-material/
├── README.md                              # Diese Datei
└── {study-id}/                            # Pro Studiengang ein Ordner
    └── NN-modul-name/                     # Modul-Ordner
        ├── overview.md                    # Modul-Übersicht, Prüfungsinfos
        └── NN-vorlesung-name/             # Vorlesungs-Unterordner
            ├── Vorlesung.md               # Vorlesungsmitschriften, Skripte
            └── CONTENT_PLAN.md            # Plan für App-Content-Generierung
```

> **Hinweis:** Die Ordnerstruktur spiegelt die `content/` Struktur wider:
> `studies-material/.../NN-modul/NN-vorlesung/` → `content/.../NN-modul/NN-vorlesung/`

## Beziehung zu content/

| Ordner/Datei                   | Zweck                                     |
| ------------------------------ | ----------------------------------------- |
| `content/studies.json`         | Master-Liste aller Studiengänge (für App) |
| `content/{study-id}/`          | Strukturierte App-Lerninhalte             |
| `studies-material/{study-id}/` | Unstrukturierte Quelldokumente/Notizen    |

## Workflow: Quelldokumente → App-Inhalte

```text
studies-material/{study-id}/NN-modul/NN-vorlesung/  →  content/{study-id}/NN-modul/NN-vorlesung/
                    (Rohmaterial)                              (App-Lerninhalte)
```

1. **Quelldokumente erstellen** - Vorlesungsmitschriften in `studies-material/.../NN-vorlesung/Vorlesung.md`
2. **Content-Plan erstellen** - Was soll in die App? (`CONTENT_PLAN.md` im selben Ordner)
3. **App-Inhalte generieren** - Lecture-Items, Quiz-Fragen in `content/{study-id}/NN-modul/NN-vorlesung/`

## Content-Erstellung

Für die AI-gestützte Content-Erstellung siehe:
**[docs/AI-Content-Creation-Setup.md](../docs/AI-Content-Creation-Setup.md)**

## Verfügbare Studiengänge

| Studiengang                          | ID                                | Status  |
| ------------------------------------ | --------------------------------- | ------- |
| BSc Ernährungswissenschaften         | `bsc-ernaehrungswissenschaften`   | ✅ Aktiv |
| BSc Lebensmittel- und Biotechnologie | `bsc-lebensmittel-biotechnologie` | ✅ Aktiv |
