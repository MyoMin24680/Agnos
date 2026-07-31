# Agnos Real-Time Patient Intake System

Real-time patient input form and staff monitoring dashboard, built for the Agnos Front-end Developer assignment.

**Patient Form:** https://agnos-76j4tvtxc-myomin24680s-projects.vercel.app/patient
**Staff View:** https://agnos-76j4tvtxc-myomin24680s-projects.vercel.app/staff
**Repository:** https://github.com/MyoMin24680/Agnos

## Overview

Two synchronized pages: patients fill out their information on the **Patient Form**, and staff monitor it live on the **Staff View** — updates appear instantly with no page reload, and a status badge shows whether the patient is Actively Filling, Inactive, or Submitted.

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- Pusher (real-time sync)
- Vercel (hosting)

## Setup

```bash
npm install
```

Add a `.env.local` file:

```
PUSHER_APP_ID=your_app_id
NEXT_PUBLIC_PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

Run:

```bash
npm run dev
```

- `/patient` — Patient Form
- `/staff` — Staff View

## Project Structure

```
app/
├── patient/page.js      # Patient Form route
├── staff/page.js        # Staff View route
└── api/pusher/route.js  # Triggers Pusher events from the server

components/
├── PatientForm.jsx       # Form fields, validation, real-time sync
├── StaffView.jsx         # Live read-only dashboard
├── FormField.jsx         # Reusable input/select/radio with floating label
└── GradientPanel.jsx     # Shared branded side panel

lib/
├── pusher.js                 # Pusher client/server setup
├── formOptions.js            # Dropdown option lists
├── validation.js             # Field validation rules
└── useDebouncedFieldSync.js  # Per-field debounce before syncing
```

## Design Decisions

- Fields are grouped into **Personal Detail**, **Contact**, and **Address** sections on both pages, so staff can match fields to the form at a glance.
- **Gender** uses radio buttons (only 3 options); **Nationality**, **Country**, **Religion**, and **Preferred Language** use dropdowns (longer lists).
- Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop.
- Required fields are marked with a red asterisk and validated on blur/submit.

## Real-Time Sync Flow

1. Typing updates the form instantly on screen (local state).
2. Each field is debounced independently (400ms) before syncing, so fast typing or browser autofill filling several fields at once doesn't drop any updates.
3. The value is sent to `/api/pusher`, which triggers a Pusher event.
4. Staff View is subscribed to that event and updates immediately.
5. Patient status (filling / inactive / submitted) is tracked and broadcast the same way.

