# WES FSM API

Base URL: `/api`

## Roles

- `admin`
- `technician`

Victor is still a `technician`, but with `specialty: "workshop"`.

## Authentication

### `GET /auth/options`

Returns the fixed login accounts shown on the landing page.

### `POST /auth/login`

```json
{
  "identity": "kirui@wes-engineering.co.ke",
  "password": "<configured-at-deploy-time>"
}
```

Response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "usr-admin-kirui",
    "fullName": "Kirui Isaiah",
    "role": "admin",
    "specialty": "office"
  }
}
```

### `GET /auth/me`

Returns the current authenticated user.

### `POST /auth/presence`

Refreshes online presence for chat/presence indicators.

### `POST /auth/logout`

Marks the current user offline.

## Users

### `GET /users`

- Admin only
- Optional query params: `role`, `specialty`

### `PATCH /users/:userId/status`

- Admin only

```json
{
  "teamStatus": "Busy",
  "baseLocation": "Nakuru",
  "phone": "+254 700 000 202"
}
```

## Dashboard

### `GET /dashboard`

Admin response includes:

- `metrics.activeJobs`
- `metrics.completedJobs`
- `metrics.pendingReports`
- `metrics.approvedReports`
- `metrics.rejectedReports`
- `metrics.reviewQueueCount`
- `technicianActivity`
- `reviewQueue`

Technician response includes:

- `metrics.assignedJobs`
- `metrics.pendingJobs`
- `metrics.inProgressJobs`
- `metrics.completedJobs`
- `metrics.submittedReports`
- `jobsByStatus.pending`
- `jobsByStatus.inProgress`
- `jobsByStatus.completed`

## Sites

### `GET /sites`

- Admin only
- Optional query param: `search`
- Returns repeat-job site options with history counts

### `GET /sites/:siteId/history`

- Admin only
- Returns the selected site and all historical field reports

## Jobs

### `GET /jobs`

Technicians only receive jobs assigned to them.

Optional query params:

- `serviceType`
- `status`
- `technicianId`
- `search`

### `GET /jobs/:jobId`

Returns:

- `job`
- `site`
- `reports`
- `siteHistory`
- `workshopReports`

Important: `siteHistory` is the full repeat-site history visible inside the job context.

### `POST /jobs`

- Admin only

```json
{
  "existingSiteId": "site-karen-ridge",
  "siteName": "Karen Ridge Villas",
  "clientName": "Karen Ridge Villas",
  "contactName": "Janet Kilonzo",
  "contactPhone": "+254 733 117 818",
  "serviceType": "Borehole",
  "manualLocation": "Karen Ridge Villas, Karen",
  "latitude": -1.3181,
  "longitude": 36.7064,
  "description": "Repeat call after low discharge and intermittent motor tripping.",
  "assignedTechnicianId": "usr-tech-lewis"
}
```

### `PATCH /jobs/:jobId`

- Admin only
- Supports reassignment, description updates, contact updates, and status changes

### `POST /jobs/:jobId/start`

- Technician only
- Moves the job from `Pending` to `In Progress`

## Field Reports

### `POST /jobs/:jobId/reports`

- Technician only
- Requires:
  - `diagnosis`
  - `workDone`
  - at least one `beforeImages` item
  - at least one `afterImages` item
  - `clientApproval.clientName`
  - `clientApproval.signatureDataUrl`

```json
{
  "capturedAt": "2026-03-29T10:15",
  "gps": {
    "latitude": -1.3181,
    "longitude": 36.7064
  },
  "diagnosis": "Low discharge caused by screen fouling.",
  "workDone": "Lifted the unit, cleaned fouling, and recommissioned the borehole line.",
  "materials": [
    {
      "name": "Thread seal tape",
      "quantity": "1",
      "unit": "roll"
    }
  ],
  "measurements": [
    {
      "label": "Flow rate",
      "value": "13",
      "unit": "m3/hr"
    }
  ],
  "notes": "Repeat-site history was reviewed before work started.",
  "beforeImages": [
    {
      "name": "before-1.jpg",
      "dataUrl": "data:image/jpeg;base64,..."
    }
  ],
  "afterImages": [
    {
      "name": "after-1.jpg",
      "dataUrl": "data:image/jpeg;base64,..."
    }
  ],
  "clientApproval": {
    "clientName": "Janet Kilonzo",
    "signatureDataUrl": "data:image/png;base64,...",
    "signedAt": "2026-03-29T10:42:00.000Z"
  }
}
```

Submitting a field report moves the job to `Completed`.

### `GET /reports`

Optional query params:

- `jobId`
- `status`
- `technicianId`
- `siteId`

Technicians only receive their own report-center list here.

### `GET /reports/:reportId`

Admins can open any report.
Technicians can open only their own report-center entries.

### `GET /review-queue`

- Admin only
- Returns:
  - `count`
  - `current`
  - `items`

### `POST /reports/:reportId/review`

- Admin only

```json
{
  "status": "Rejected",
  "reviewNotes": "Retake clearer after-work images and include the load test values."
}
```

Rules:

- `Approved` moves the job to `Approved`
- `Rejected` moves the job back to `In Progress`
- approved reports never return to the review queue

### `GET /reports/:reportId/export`

- Available only for approved reports
- Admins can download any approved report
- Technicians can download only their own approved reports

## Workshop Reports

### `GET /workshop-reports`

Optional query param:

- `jobId`

### `POST /jobs/:jobId/workshop-reports`

- Technician only
- Allowed for the assigned technician or Victor

```json
{
  "repairDetails": "Bench-tested the inverter cooling path and replaced a failing fan assembly.",
  "partsReplaced": [
    {
      "name": "Cooling fan",
      "quantity": "1",
      "unit": "pc"
    }
  ],
  "notes": "Bench work complete. Awaiting field reinstall.",
  "beforeImages": [],
  "afterImages": []
}
```

## Search

### `GET /search`

Optional query params:

- `technicianName`
- `siteName`
- `clientName`
- `workType`
- `date`
- `serviceType`
- `status`
- `technicianId`

Returns:

- `jobs`
- `reports`
- `total`

## Forum

### `GET /forum/messages`

Returns:

- `messages`
- `onlineUsers`

### `POST /forum/messages`

```json
{
  "body": "Workshop note: cooling path is ready for reinstall.",
  "replyToId": "msg-001",
  "attachments": [
    {
      "name": "bench-finish.jpg",
      "dataUrl": "data:image/jpeg;base64,..."
    }
  ]
}
```

### `GET /forum/stream?token=<jwt>`

Server-sent events stream for:

- `snapshot`
- `message`
- `presence`
