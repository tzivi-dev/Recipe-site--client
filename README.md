# Recipe Sharing Platform — Client

## Overview
The frontend application for the Recipe Sharing Platform, built with Angular 17. Communicates with the Python/Flask backend via a RESTful API and provides a full user interface for browsing recipes, submitting new ones, and managing user permissions.

## Core Capabilities

- **Routing & Navigation** — Angular Router with route guards protecting pages based on authentication state and user role.
- **Authentication Flow** — Login and registration forms with JWT storage. Unauthorized users are redirected automatically.
- **Recipe Gallery** — Filterable and sortable grid of recipe cards. Supports filtering by type (Dairy, Meat, Parve) and prep time.
- **Recipe Detail View** — Full recipe page including the complete ingredient list, preparation instructions, and a four-image variant gallery.
- **Add Recipe Form** — Dynamic form for approved uploaders, including ingredient management (add/remove rows) and image upload with live preview.
- **Personal Area** — Displays user profile details. Uploaders can submit new recipes; Readers can request upload permissions.
- **Admin Panel** — Lists users with pending permission requests. Admins can approve requests directly from the panel.

## Technology Stack

- **Framework:** Angular 17
- **Language:** TypeScript
- **Styling:** CSS
- **HTTP Client:** Angular HttpClient
- **Forms:** Angular Reactive Forms

## Component Structure

```
src/app/
├── components/
│   ├── add-recipe/          # Multi-ingredient recipe submission form
│   ├── admin-panel/         # Permission request management
│   ├── home/                # Landing page
│   ├── login/               # Authentication forms
│   ├── profile/             # Personal area and upload request
│   ├── recipe-detail/       # Full single recipe view with image gallery
│   └── recipe-list/         # Filterable recipe gallery
├── guards/                  # Route protection (auth, role-based)
├── models/                  # TypeScript interfaces
└── services/                # API communication layer
```

## Setup & Installation

**Prerequisites:** Node.js 18+ and Angular CLI 17.

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application reloads automatically on file changes.

> The backend server must be running on `http://localhost:5000` for API calls to resolve.

## Build

```bash
ng build
```

Build artifacts are output to the `dist/` directory.

## Useful Commands

- `ng generate component component-name` — Scaffold a new component.
- `ng generate service service-name` — Scaffold a new service.
- `ng test` — Run unit tests via Karma.
- `ng help` — Angular CLI reference.