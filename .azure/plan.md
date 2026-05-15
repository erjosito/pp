# Azure Deployment Plan

> **Status:** Ready for Validation

Generated: 2026-05-15

---

## 1. Project Overview

**Goal:** Build a single-page web application that helps the user study for her FOS Pädagogik & Psychologie exam through interactive flashcards (with click-to-flip animation) and an option to read full chapter summaries. Deploy it to Azure Container Apps for easy access from any device.

**Path:** New Project (greenfield)

---

## 2. Requirements

| Attribute | Value |
|-----------|-------|
| Classification | POC / personal study tool |
| Scale | Small (single user, low traffic) |
| Budget | Cost-Optimized |
| **Subscription** | `a8fbd8e1-fb5a-4411-804a-4ac80929c93c` (Litware-MngEnvMCAP642473-jomore) ✅ confirmed active |
| **Location** | `westeurope` (closest to Bayern, low latency) |

---

## 3. Components Detected

| Component | Type | Technology | Path |
|-----------|------|------------|------|
| webapp | Frontend (static site) | HTML / CSS / vanilla JS, served by nginx | `src/webapp/` |
| flashcards.json | Data | JSON with ~70+ flashcards covering all exam topics | `src/webapp/public/data/` |
| summaries | Content | Markdown files (the 9 chapters from this folder) rendered with marked.js | `src/webapp/public/summaries/` |

---

## 4. Recipe Selection

**Selected:** AZD (Bicep)

**Rationale:**
- Greenfield single-service container app — `azd up` is the simplest path from zero to deployed
- AZD auto-generates environment management, no manual ACR push needed
- Bicep over Terraform: Azure-only deployment, lower learning curve, faster iteration
- User has time pressure (exam Monday) — the simplest workflow wins

---

## 5. Architecture

**Stack:** Containers (single static-site container on Azure Container Apps)

### Service Mapping

| Component | Azure Service | SKU |
|-----------|---------------|-----|
| webapp | Azure Container Apps | Consumption (scale-to-zero capable, but min 1 replica to avoid cold starts) |
| Container image storage | Azure Container Registry | Basic |

### Supporting Services

| Service | Purpose |
|---------|---------|
| Container Apps Environment | Hosting environment (1× managed env in westeurope) |
| Log Analytics Workspace | Centralized logging for the Container Apps Environment |
| Application Insights | Optional monitoring (lightweight, useful for debugging) |
| User-Assigned Managed Identity | Secure pull from ACR (no passwords/secrets needed) |

### Architecture Diagram

```
┌─────────────────┐
│  Browser (You)  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────────────────────────────┐
│     Azure Container Apps (westeurope)   │
│                                         │
│   ┌──────────────────────────────┐      │
│   │   nginx + static webapp      │      │
│   │   - flashcards (JSON)        │      │
│   │   - summaries (Markdown)     │      │
│   │   - card-flip animation      │      │
│   └──────────────────────────────┘      │
│              ▲                          │
│              │ pulls image (UAMI)       │
└──────────────┼──────────────────────────┘
               │
   ┌───────────┴────────────┐
   │ Azure Container Reg.   │
   │ (Basic SKU)            │
   └────────────────────────┘
```

---

## 6. Provisioning Limit Checklist

### Resource Inventory + Quota Validation

| Resource Type | Number to Deploy | Total After Deployment | Limit/Quota | Notes |
|---------------|------------------|------------------------|-------------|-------|
| Microsoft.App/managedEnvironments | 1 | 1 | 50 | Fetched from: azure-quotas (ManagedEnvironmentCount, westeurope) |
| Microsoft.App/containerApps | 1 | _new_ | 1000 per env | Fetched from: official Azure limits docs |
| Microsoft.ContainerRegistry/registries | 1 | _new_ | 500 | Fetched from: official Azure limits docs |
| Microsoft.OperationalInsights/workspaces | 1 | _new_ | very high | Fetched from: official Azure limits docs |
| Microsoft.Insights/components | 1 | _new_ | very high | Fetched from: official Azure limits docs |
| Microsoft.ManagedIdentity/userAssignedIdentities | 1 | _new_ | very high | Fetched from: official Azure limits docs |
| Microsoft.Resources/resourceGroups | 1 | _new_ | 980 per subscription | Standard subscription limit |

**Status:** ✅ All resources well within limits — single-instance, lightweight deployment

---

## 7. Execution Checklist

### Phase 1: Planning
- [x] Analyze workspace
- [x] Gather requirements
- [x] Confirm subscription and location with user
- [x] Prepare resource inventory
- [x] Fetch quotas and validate capacity
- [x] Scan codebase
- [x] Select recipe
- [x] Plan architecture
- [x] **User approves this plan**

### Phase 2: Execution
- [x] Build flashcards.json (70+ cards from the 9 summary chapters)
- [x] Copy 9 summary markdown files into `src/webapp/public/summaries/`
- [x] Create static web app (HTML, CSS with 3D flip, vanilla JS)
- [x] Create Dockerfile (nginx:alpine)
- [x] Generate `azure.yaml` (AZD config)
- [x] Generate `infra/main.bicep` (subscription scope) + `infra/main.parameters.json`
- [x] Generate Container Apps Bicep modules
- [ ] Initialize git repo + push to https://github.com/erjosito/pp
- [x] Update plan status to "Ready for Validation"

### Phase 3: Validation
- [ ] Invoke azure-validate skill
- [ ] All validation checks pass
- [ ] Update plan status to "Validated"

### Phase 4: Deployment
- [ ] Invoke azure-deploy skill (`azd up`)
- [ ] Deployment successful
- [ ] Verify URL works in browser
- [ ] Update plan status to "Deployed"

---

## 8. Files to Generate

| File | Purpose | Status |
|------|---------|--------|
| `.azure/plan.md` | This plan | ✅ |
| `azure.yaml` | AZD configuration | ⏳ |
| `infra/main.bicep` | Infrastructure entry (subscription scope) | ⏳ |
| `infra/main.parameters.json` | AZD parameters | ⏳ |
| `infra/resources.bicep` | Resource group scoped resources | ⏳ |
| `src/webapp/Dockerfile` | nginx container build | ⏳ |
| `src/webapp/nginx.conf` | nginx config (gzip, cache, port 8080) | ⏳ |
| `src/webapp/public/index.html` | Web app shell | ⏳ |
| `src/webapp/public/styles.css` | Styling + 3D flip animation | ⏳ |
| `src/webapp/public/app.js` | Card logic + summary viewer | ⏳ |
| `src/webapp/public/data/flashcards.json` | All flashcards | ⏳ |
| `src/webapp/public/summaries/*.md` | The 9 chapter summaries (copied) | ⏳ |
| `.gitignore` | Ignore .azure folder, node_modules etc. | ⏳ |
| `README.md` | Quick description for the GitHub repo | ⏳ |

---

## 9. Web App Features

| Feature | Description |
|---------|-------------|
| 🎴 **Random Flashcards** | Click to flip card and reveal answer; "Next card" button shuffles |
| 📚 **Topic Filter** | Filter cards by topic (Lerntheorien, Persönlichkeit, etc.) — optional |
| 📖 **Summaries View** | Toggle to view the full chapter summaries (rendered markdown) |
| 🎲 **True random** | No card repeats until deck cycles through |
| 📱 **Mobile-friendly** | Responsive design, works on phone for last-minute studying |
| 🌙 **Dark mode** | Easy on the eyes for late-night cramming |

---

## 10. Next Steps

> Current: Awaiting plan approval

1. User approves plan
2. Build flashcards.json + web app files
3. Generate Bicep + azure.yaml
4. Initialize git + push to GitHub
5. Validate, then deploy with `azd up`
