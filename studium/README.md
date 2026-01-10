# Studium Referenzmaterial

Dieser Ordner enthält **Quelldokumente** aus dem Studium, die als Grundlage für die App-Lerninhalte dienen.

## Ordnerstruktur

```text
studium/
├── BSc_Ernaehrungswissenschaften.md   # Curriculum-Übersicht
├── README.md                          # Diese Datei
└── NN-modul-name/                     # Module (NN = 01-14)
    ├── 00-uebersicht.md               # Modul-Übersicht, Prüfungsinfos
    ├── 01-kapitel-name.md             # Vorlesungsmitschriften, Skripte
    ├── 02-kapitel-name.md
    ├── ...
    └── Content-Plan.md                # Plan für App-Content-Generierung
```

## Workflow: Quelldokumente → App-Inhalte

```text
studium/NN-modul/XX-kapitel.md     →  content/NN-modul/XX-lecture/
       (Rohmaterial)                        (App-Lerninhalte)
```

1. **Quelldokumente erstellen** - Vorlesungsmitschriften, Skripte in `studium/`
2. **Content-Plan erstellen** - Was soll in die App? (`Content-Plan.md`)
3. **App-Inhalte generieren** - Lecture-Items, Quiz-Fragen in `content/`

## Content-Erstellung

Für die AI-gestützte Content-Erstellung siehe:
**[docs/AI-Content-Creation-Setup.md](../docs/AI-Content-Creation-Setup.md)**

## Namenskonventionen

| Element      | Format               | Beispiel                 |
| ------------ | -------------------- | ------------------------ |
| Modul-Ordner | `NN-modul-name/`     | `02-grundlagen-chemie/`  |
| Übersicht    | `00-uebersicht.md`   | Prüfungsinfos, Literatur |
| Kapitel      | `NN-kapitel-name.md` | `01-materie-messen.md`   |
| Content-Plan | `Content-Plan.md`    | Generierungsplan         |

## Aktueller Stand

| Modul                | Quelldokumente | Content-Plan |
| -------------------- | -------------- | ------------ |
| 02-grundlagen-chemie | ✅ Vorhanden    | ✅ Vorhanden  |
| Andere Module        | ⏳ Noch leer    | —            |
