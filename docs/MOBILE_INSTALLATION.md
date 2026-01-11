# Mobile App Installation

Die Study App kann als Progressive Web App (PWA) auf dem Smartphone installiert werden. Mit Push-Benachrichtigungen wirst du an ablaufende Achievements erinnert.

## Android Installation

### 1. App installieren

1. Öffne **Chrome** auf deinem Android-Gerät
2. Gehe zu: **https://rrust.github.io/ew-bachelor/**
3. Tippe auf das **⋮ Menü** (drei Punkte oben rechts)
4. Wähle **"App installieren"** oder **"Zum Startbildschirm hinzufügen"**
5. Bestätige mit **"Installieren"**

Die App erscheint nun auf deinem Startbildschirm.

### 2. Push-Benachrichtigungen aktivieren

1. Öffne die installierte App vom Startbildschirm
2. Tippe auf das **Glocken-Symbol** 🔔 im Header
3. Im blauen Kasten: Tippe auf **"Aktivieren"**
4. Erlaube Benachrichtigungen im System-Dialog

### 3. Android-Einstellungen prüfen

Falls keine Benachrichtigungen ankommen:

1. Gehe zu **Einstellungen → Apps**
2. Finde die App (z.B. "Study" oder "BSc EW")
3. Tippe auf **Benachrichtigungen**
4. Aktiviere:
   - ✅ Benachrichtigungen anzeigen
   - ✅ Pop-up auf Bildschirm
   - ✅ Auf Sperrbildschirm anzeigen

---

## iOS Installation (iPhone/iPad)

### Voraussetzungen

- **iOS 16.4 oder neuer** (ältere Versionen unterstützen keine Web Push)
- **Safari** Browser (Chrome auf iOS unterstützt keine PWA-Notifications)

### 1. App installieren

1. Öffne **Safari** auf deinem iPhone/iPad
2. Gehe zu: **https://rrust.github.io/ew-bachelor/**
3. Tippe auf das **Teilen-Symbol** ⎋ (unten in der Mitte)
4. Scrolle und wähle **"Zum Home-Bildschirm"**
5. Tippe auf **"Hinzufügen"**

### 2. Push-Benachrichtigungen aktivieren

1. Öffne die App vom Home-Bildschirm (**nicht** aus Safari!)
2. Tippe auf das **Glocken-Symbol** 🔔
3. Tippe auf **"Aktivieren"**
4. Erlaube im iOS-Dialog

### 3. iOS-Einstellungen prüfen

Falls keine Benachrichtigungen ankommen:

1. Gehe zu **Einstellungen → Mitteilungen**
2. Finde die App in der Liste
3. Aktiviere:
   - ✅ Mitteilungen erlauben
   - ✅ Sperrbildschirm
   - ✅ Mitteilungszentrale
   - ✅ Banner

---

## Was die Benachrichtigungen zeigen

Du erhältst eine Benachrichtigung wenn:

- **Achievements bald ablaufen** (weniger als 7 Tage)
- **Achievements abgelaufen sind** (müssen erneuert werden)

Die Benachrichtigung erscheint **einmal pro Tag** beim Öffnen der App.

Tippe auf die Benachrichtigung um direkt zur Alerts-Seite zu gelangen.

---

## Troubleshooting

### "Push-Benachrichtigungen blockiert"

Die Permission wurde verweigert. So aktivierst du sie wieder:

**Android:**
1. Einstellungen → Apps → [App-Name] → Benachrichtigungen → Aktivieren

**iOS:**
1. Einstellungen → Mitteilungen → [App-Name] → Mitteilungen erlauben

### Keine Benachrichtigungen trotz Aktivierung

1. Stelle sicher dass du die App **vom Startbildschirm** öffnest (nicht im Browser)
2. Prüfe dass **"Nicht stören"** deaktiviert ist
3. Prüfe die **System-Benachrichtigungseinstellungen**

### Test-Funktion (nur im Dev-Mode)

1. Aktiviere Dev-Mode: Tools → Dev Mode
2. Gehe zu Alerts (Glocken-Symbol)
3. Tippe "Demo-Alerts" um Test-Alerts zu erstellen
4. Tippe "Test Push" um eine Test-Benachrichtigung zu senden
