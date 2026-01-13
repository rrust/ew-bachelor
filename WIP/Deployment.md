# Deployment - GELÖST ✅

## Neue einheitliche Pipeline: `.github/workflows/deploy.yml`

Die alten separaten Workflows (`deploy-pages.yml` und `generate-content.yml`) wurden durch einen einzigen, vereinfachten Workflow ersetzt.

### Features

1. **Automatische Erkennung von Content-Änderungen**
   - Bei Push auf `main`: Prüft ob `.md` Dateien in `content/` geändert wurden
   - Generiert Bundles nur wenn nötig

2. **Manueller Trigger von jedem Branch**
   - GitHub Actions → "Build & Deploy" → "Run workflow"
   - Branch auswählen oder leer lassen für aktuellen Branch

3. **Skip Bundle Generation Option**
   - Checkbox "Skip content bundle generation"
   - Für schnelle Deploys wenn nur Code geändert wurde

4. **Alles in einem Workflow**
   - Generiert Content-Bundles (wenn nötig)
   - Committet generierte JSON-Dateien
   - Deployed zu GitHub Pages

### GitHub Pages Einstellung

In Repository Settings → Pages:
- **Source:** "GitHub Actions" (nicht "Deploy from a branch"!)
- Dies deaktiviert das automatische Deployment vom Branch und nutzt nur unseren Workflow

### Usage

```bash
# Normaler Push - automatisches Deployment
git push origin main

# Manuelles Deployment
# → GitHub Actions Tab → "Build & Deploy" → "Run workflow"
```