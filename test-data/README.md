# Test Progress Data

Generated test data for testing the Progress screen with various completion states.

**These files use the app's native export format and can be imported via Tools → Import Progress.**

## Scenarios

| Scenario | Description |
|----------|-------------|
| `fresh` | New user, no progress at all |
| `beginner` | First 1-2 modules started, mostly low scores |
| `intermediate` | About half completed, mixed badges |
| `advanced` | Most completed, mostly silver/gold |
| `complete` | Everything done with gold badges + all achievements |
| `mixed` | Realistic distribution of all states |

## How to Import

1. Open the app in browser
2. Go to **Tools** (menu → Tools)
3. Click **Import Progress**
4. Select a file from this folder (e.g., `progress-bsc-ernaehrungswissenschaften-complete.json`)
5. The app will reload with the test data

## Alternative: Console Import

```javascript
// In browser console - adjust filename as needed
fetch('test-data/progress-bsc-ernaehrungswissenschaften-complete.json')
  .then(r => r.json())
  .then(data => {
    localStorage.setItem('progress_' + data.studyId, JSON.stringify(data.progress));
    location.reload();
  });
```

## Reset Progress

Go to **Tools → Reset Progress** or run in console:
```javascript
localStorage.removeItem('progress_bsc-ernaehrungswissenschaften');
location.reload();
```

## Regenerate Test Data

```bash
node generate-test-progress.js
```
