## ✦ Why ParSec?

| 🔒 Local-First | 🧩 Modular | 📄 Flexible |
| --- | --- | --- |
| Parish records are designed to remain within the parish's local data environment. | ParSec is organized into independent modules that can grow over time. | Parishes can maintain their own forms and document templates. |

## 🗂️ Parish Management Modules

| Module | Purpose |
| --- | --- |
| 👥 People | Parishioner and family records |
| 🏘️ GKK | GKK and zone organization |
| ✝️ Sacraments | Baptism, Confirmation, Communion, Marriage, Anointing and Funeral records |
| 📄 Certificates | Certificate requests and document generation |
| 📅 Calendar | Parish events and schedules |
| 📦 Inventory | Parish property and supplies |
| 💰 Finance | Income, expenses, donations and collections |
| 📊 Reports | Administrative and statistical reports |
| 💾 Backup | Local backup and restore |
| 🧾 Audit | System activity records |
| 👤 Access | Users, roles and permissions |
| 📝 Templates | Parish-specific forms and document templates |
| 🛠️ Support | Problem reporting and developer contact |

## 📄 Parish-Specific Forms

One of ParSec's important design goals is not forcing every parish to use exactly the same paperwork. Different parishes may already have their own:

* Baptism forms
* Confirmation forms
* Marriage forms
* Funeral forms
* Certificate formats
* Registration documents
* Parish reports
* Other administrative documents

ParSec is designed to accommodate those differences.

```text
Existing Parish Form
        │
        ▼
   Upload Template
        │
        ▼
   Store Locally
        │
        ▼
  Optional Field Mapping
        │
        ▼
   Parish Record
        │
        ▼
 Completed Document
        │
        ▼
      Print

```

## 🏗️ Architecture

Local data model

```text
ParishSystem/
│
├── account/
├── parish/
├── parishioners/
├── families/
├── gkk/
├── sacraments/
├── certificates/
├── events/
├── finance/
├── inventory/
├── templates/
├── reports/
├── audit/
├── backups/
└── system/

```

## 🔐 Privacy by Architecture

ParSec is designed around a simple principle:

**Parish data should belong to the parish that created it.**

The public application provides the software interface, while parish-specific records are intended to remain in the parish's own local environment.

```text
                    INTERNET
                       │
                       │
                 ParSec Website
                       │
                       │
              Application Interface
                       │
                       ▼
              ┌──────────────────┐
              │ Parish Computer  │
              └────────┬─────────┘
                       │
                       ▼
                ParishSystem/
                       │
          ┌────────────┴────────────┐
          │                         │
     Parish Data              Local Backups

```

No architecture should be described as completely secure merely because it is local; proper permissions, backups, device security, and application security still matter.

## ⚙️ Technology

| Technology | Role |
| --- | --- |
| ⚛️ React | User interface |
| 🔷 TypeScript | Application language |
| ⚡ Vite | Development and build system |
| 🗃️ IndexedDB | Local browser metadata |
| 📁 File System Access API | Local parish folder access |
| 🔥 Firebase Hosting | Web application hosting |
| 🧪 Testing | Unit, integration and E2E testing |

## 🚀 Development Roadmap

```text
Foundation
    ████████████████████░░░░

Parish Information
    ██████████░░░░░░░░░░░░░░

Parishioners
    ███░░░░░░░░░░░░░░░░░░░░░

Sacraments
    ██░░░░░░░░░░░░░░░░░░░░░░

Finance
    ██░░░░░░░░░░░░░░░░░░░░░░

Templates
    ██░░░░░░░░░░░░░░░░░░░░░░

Reports
    ░░░░░░░░░░░░░░░░░░░░░░░░

Security Hardening
    ░░░░░░░░░░░░░░░░░░░░░░░░

```

Current focus: building the foundation and expanding the system module by module.

## 🖥️ Current Interface

The current ParSec dashboard follows a deliberately quiet visual language:

* Clean whitespace
* Minimal navigation
* Teal primary typography
* Warm neutral background
* Small coral accents
* Clear connection status
* Information presented without unnecessary visual clutter

The goal is to make the system feel appropriate for a real parish office, rather than a generic enterprise dashboard.

## 🧑‍💻 Developer

**Alabila**

*ParSec Developer*

* 📧 devsupportqtbby@gmail.com
* 🐙 GitHub: @qtbby

## 🛠️ Report a Problem

Found something that isn't working?
ParSec includes a developer-support section where users can report problems and contact the developer. When reporting an issue, users can provide:

* Problem description
* Module affected
* Problem type
* Browser information
* Application version
* Other safe diagnostic information

Private parish records should never be automatically attached to a problem report.

## 🌍 Project Vision

ParSec is being developed with a worldwide perspective. Parishes may differ in:

* Administrative structures
* Forms
* Sacramental documentation
* GKK structures
* Reporting requirements
* Local workflows

The system therefore aims to provide a common foundation without forcing every parish into an identical workflow.
