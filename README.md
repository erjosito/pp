# 📚 P&P Lernhelfer

> Eine kleine Web-App zur Prüfungsvorbereitung in **Pädagogik & Psychologie** für die FOS Bayern, 12. Klasse Sozialwesen.

## ✨ Features

- 🎴 **Karteikarten** mit ~70+ Fragen aus allen prüfungsrelevanten Themen
- 🔄 **Klick zum Umdrehen** mit 3D-Flip-Animation
- 🎲 **Zufällige Reihenfolge** + Filter nach Themengebiet
- 📖 **Vollständige Zusammenfassungen** in 9 Kapiteln (Markdown gerendert)
- 🌙 **Dark Mode** für nächtliches Lernen
- 📱 **Mobile-optimiert** für Lernen unterwegs

## 📂 Inhalt

```
.
├── 00-README.md ... 08-Verbindungen-und-Anwendung.md   # 9 Lehrbuch-Kapitel
├── src/webapp/                                          # Statische Web-App
│   ├── public/
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── app.js
│   │   ├── data/flashcards.json                         # Alle Karteikarten
│   │   └── summaries/                                   # Markdown-Kapitel
│   ├── Dockerfile
│   └── nginx.conf
├── infra/                                               # Bicep-Infrastruktur
│   ├── main.bicep
│   ├── resources.bicep
│   └── main.parameters.json
└── azure.yaml                                           # Azure Developer CLI Config
```

## 🚀 Lokal starten

Einfacher HTTP-Server:

```powershell
cd src/webapp/public
python -m http.server 8080
# oder
npx serve .
```

Dann im Browser: <http://localhost:8080>

## ☁️ Deployment auf Azure

Voraussetzungen: Azure-CLI + Azure Developer CLI (azd) installiert und eingeloggt.

```powershell
azd up
```

Das deployt:

- **Azure Container Apps** (Hosting für die Web-App, Consumption-Plan)
- **Azure Container Registry** (Basic, für das Docker-Image)
- **Log Analytics + Application Insights** (Monitoring)
- **User-Assigned Managed Identity** (Secret-freier Pull aus ACR)

### 🚀 Live-Deployment

Aktuell deployt unter:
**<https://ca-pp-webapp-buzazo.victoriousbeach-4a138dbf.westeurope.azurecontainerapps.io/>**

## 📝 Themenbereiche

Die Karten und Zusammenfassungen decken folgende Bereiche des bayerischen FOS-Lehrplans Pädagogik & Psychologie (Sozialwesen, 12. Klasse) ab:

1. **Psychologische Strömungen** (Tiefenpsychologie, Behaviorismus, Kognitivismus, Humanismus)
2. **Lerntheorien** (Pawlow, Thorndike, Skinner, Bandura)
3. **Persönlichkeitstheorien** (Freud, Rogers, Big Five)
4. **Motivation** (Maslow, Selbstwirksamkeit, Selbstbestimmungstheorie)
5. **Kommunikation** (Watzlawick, Schulz von Thun, Gordon)
6. **Erziehungsstile** (Lewin, antiautoritäre Erziehung)
7. **Entwicklung** (Anlage × Umwelt × Selbststeuerung)
8. **Verbindungen & Fallbeispiel-Anwendung**

## 🎯 Lernstrategie

Siehe Kapitel 00-README.md → Lernanleitung. Kurzfassung:

1. **Aktives Abrufen** statt nur Lesen
2. **Vernetzen** der Theorien (siehe Kapitel 08)
3. **Fallbeispiele** üben (alte Prüfungen!)
4. **Schlaf > Cramming** vor dem Prüfungstag

---

🍀 Viel Erfolg in der Prüfung!
