# Studies - Studiengänge

Dieser Ordner enthält die **Studiengangs-Definitionen** und **Referenzmaterial** für alle unterstützten Studiengänge.

## Ordnerstruktur

```text
studies/
├── studies.json                       # Master-Liste aller Studiengänge (für App)
├── README.md                          # Diese Datei
└── {study-id}/                        # Pro Studiengang ein Ordner
    ├── study.md                       # Studiengangs-Metadaten (für App)
    └── NN-modul-name/                 # Quelldokumente/Notizen (optional)
        ├── 00-uebersicht.md           # Modul-Übersicht, Prüfungsinfos
        ├── 01-kapitel-name.md         # Vorlesungsmitschriften, Skripte
        └── Content-Plan.md            # Plan für App-Content-Generierung
```

## Dateien für die App

| Datei | Zweck |
|-------|-------|
| `studies.json` | Master-Liste aller Studiengänge (Icon, Titel, Status) |
| `{study-id}/study.md` | Studiengangs-Beschreibung mit YAML-Frontmatter |

## Quelldokumente (Referenzmaterial)

Zusätzlich können in den Studiengangs-Ordnern Quelldokumente abgelegt werden:

### Workflow: Quelldokumente → App-Inhalte

```text
studies/{study-id}/NN-modul/XX-kapitel.md  →  content/{study-id}/NN-modul/XX-lecture/
              (Rohmaterial)                           (App-Lerninhalte)
```

1. **Quelldokumente erstellen** - Vorlesungsmitschriften, Skripte
2. **Content-Plan erstellen** - Was soll in die App? (`Content-Plan.md`)
3. **App-Inhalte generieren** - Lecture-Items, Quiz-Fragen in `content/{study-id}/`

## Content-Erstellung

Für die AI-gestützte Content-Erstellung siehe:
**[docs/AI-Content-Creation-Setup.md](../docs/AI-Content-Creation-Setup.md)**

## Verfügbare Studiengänge

| Studiengang | ID | Status |
|-------------|-----|--------|
| BSc Ernährungswissenschaften | `bsc-ernaehrungswissenschaften` | ✅ Aktiv |
| BSc Lebensmittel- und Biotechnologie | `bsc-lebensmittel-biotechnologie` | ✅ Aktiv |
