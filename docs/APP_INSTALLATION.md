# App Installation

Die Study App ist eine Progressive Web App (PWA) und kann auf allen Geräten installiert werden – Smartphone, Tablet und Desktop. Mit Push-Benachrichtigungen wirst du an ablaufende Achievements erinnert.

## Was ist eine PWA?

Eine Progressive Web App funktioniert wie eine native App, wird aber über den Browser installiert. Vorteile:

- ✅ Kein App Store nötig
- ✅ Funktioniert offline
- ✅ Automatische Updates
- ✅ Weniger Speicherverbrauch als native Apps
- ✅ Push-Benachrichtigungen (auf unterstützten Geräten)

---

## 📱 Smartphone (Android)

### Installation

1. Öffne **Chrome** auf deinem Android-Gerät
2. Gehe zu: **https://rrust.github.io/ew-bachelor/**
3. Tippe auf das **⋮ Menü** (drei Punkte oben rechts)
4. Wähle **"App installieren"** oder **"Zum Startbildschirm hinzufügen"**
5. Bestätige mit **"Installieren"**

Die App erscheint auf deinem Startbildschirm.

### Push-Benachrichtigungen

1. Öffne die App vom Startbildschirm
2. Tippe auf das **Glocken-Symbol** 🔔 im Header
3. Tippe auf das **Glocken-Icon** rechts oben (oder "Aktivieren")
4. Erlaube Benachrichtigungen im System-Dialog

**Falls keine Benachrichtigungen ankommen:**

1. Einstellungen → Apps → [App-Name] → Benachrichtigungen
2. Aktiviere: Anzeigen, Pop-up, Sperrbildschirm

---

## 📱 Smartphone/Tablet (iOS – iPhone/iPad)

### Voraussetzungen

- **iOS 16.4 oder neuer** (ältere Versionen unterstützen keine Web Push)
- **Safari** Browser (Chrome auf iOS unterstützt keine PWA-Features)

### Installation

1. Öffne **Safari** auf deinem iPhone/iPad
2. Gehe zu: **https://rrust.github.io/ew-bachelor/**
3. Tippe auf das **Teilen-Symbol** ⎋ (unten in der Mitte)
4. Scrolle und wähle **"Zum Home-Bildschirm"**
5. Tippe auf **"Hinzufügen"**

### Push-Benachrichtigungen

1. Öffne die App vom Home-Bildschirm (**nicht** aus Safari!)
2. Tippe auf das **Glocken-Symbol** 🔔
3. Tippe auf das **Glocken-Icon** rechts oben
4. Erlaube im iOS-Dialog

**Falls keine Benachrichtigungen ankommen:**

1. Einstellungen → Mitteilungen → [App-Name]
2. Aktiviere: Mitteilungen erlauben, Sperrbildschirm, Banner

---

## 📱 Android Tablet

Funktioniert identisch wie Android Smartphone:

1. Öffne **Chrome**
2. Gehe zu: **https://rrust.github.io/ew-bachelor/**
3. Tippe auf **⋮ Menü** → **"App installieren"**

Die App passt sich automatisch an die größere Bildschirmgröße an.

---

## 💻 Desktop (Windows, macOS, Linux)

### Chrome / Edge

1. Öffne **Chrome** oder **Microsoft Edge**
2. Gehe zu: **https://rrust.github.io/ew-bachelor/**
3. Klicke auf das **Installations-Symbol** in der Adressleiste (⊕ oder ↓)
4. Oder: **⋮ Menü** → **"App installieren"**
5. Bestätige mit **"Installieren"**

Die App erscheint im Startmenü / Launchpad / Applications.

### Push-Benachrichtigungen

1. Öffne die installierte App
2. Klicke auf das **Glocken-Symbol** 🔔
3. Klicke auf das **Glocken-Icon** rechts oben
4. Erlaube im Browser-Dialog

**macOS:** Prüfe Systemeinstellungen → Mitteilungen → Chrome/Edge

**Windows:** Prüfe Einstellungen → System → Benachrichtigungen → Chrome/Edge

### Firefox

Firefox unterstützt PWA-Installation nicht direkt, aber die App funktioniert vollständig im Browser-Tab.

---

## 🔔 Push-Benachrichtigungen

### Was wird benachrichtigt?

- **Achievements bald ablaufen** (weniger als 7 Tage)
- **Achievements abgelaufen sind** (müssen erneuert werden)

### Wann erscheint die Benachrichtigung?

- **Einmal pro Tag** beim Öffnen der App
- Tippe/Klicke auf die Benachrichtigung → öffnet die Alerts-Seite

### Status prüfen

Auf der Alerts-Seite (Glocken-Symbol) siehst du rechts oben:

| Symbol              | Bedeutung                                      |
| ------------------- | ---------------------------------------------- |
| ✅ Grünes Häkchen    | Push-Benachrichtigungen aktiv                  |
| 🔔 Graue Glocke      | Noch nicht aktiviert (klicken zum Aktivieren)  |
| ⚠️ Gelbes Warnsymbol | Blockiert (in System-Einstellungen aktivieren) |

---

## ❓ Troubleshooting

### App lässt sich nicht installieren

- Stelle sicher dass du **Chrome** (Android/Desktop) oder **Safari** (iOS) verwendest
- Prüfe ob die Seite über **HTTPS** geladen wird
- Lösche den Browser-Cache und versuche es erneut

### Push-Benachrichtigungen funktionieren nicht

1. Öffne die App **vom Startbildschirm** (nicht im Browser-Tab)
2. Prüfe dass **"Nicht stören"** deaktiviert ist
3. Prüfe die **System-Benachrichtigungseinstellungen** für die App
4. Auf iOS: Nur mit iOS 16.4+ und Safari möglich

### App zeigt alte Inhalte

Die App cached Inhalte für Offline-Nutzung. Zum Aktualisieren:

1. Öffne die App
2. Ziehe die Seite nach unten (Pull-to-Refresh)
3. Oder: Schließe die App komplett und öffne sie neu

### Test-Funktion (Entwickler)

1. Tools → Dev Mode aktivieren
2. Gehe zu Alerts (Glocken-Symbol)
3. Tippe "Demo-Alerts" um Test-Alerts zu erstellen
4. Tippe "Test Push" um eine Test-Benachrichtigung zu senden
