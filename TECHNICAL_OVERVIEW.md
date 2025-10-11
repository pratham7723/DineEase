## ScanIn — Technical Overview

This document explains how the system works end‑to‑end: architecture, technologies used (and why), core flows, data model, security, performance, deployment, and interview‑ready Q&A.

---

### 1) Architecture at a glance

- Frontend: React + TypeScript (Vite) SPA with shadcn/ui components for a consistent UI system.
- Backend: Convex (managed serverless database + functions) exposing typed queries/mutations and real‑time subscriptions.
- Auth: Email OTP sign‑in issuing short‑lived sessions with claims (userId, tenantId, roles).
- Multi‑tenancy + RBAC: Tenant isolation and role enforcement on every read/write.
- Real‑time data: React components subscribe to Convex queries that auto‑update on writes.
- Deploy: Frontend (e.g., Vercel) + Convex managed backend.

Why this architecture:
- Convex removes boilerplate API/ORM layers, gives real‑time out of the box, and enforces consistency/transactions in functions.
- React + TS + Vite gives fast DX, type safety, and modern build tooling.

---

### 2) Core user flows

1. Sign‑in (Email OTP)
   - User requests OTP → receives code → verifies → session created with claims { userId, tenantId, roles }.
   - Client hydrates session, role, and tenant context; protected routes unlock.

2. QR attendance capture
   - Camera opens with getUserMedia → QR decoded client‑side → mutation call with { studentId, sessionId, timestamp }.
   - Server validates timetable window, subject/classroom match, and idempotency; writes attendance record.
   - Subscribed UI updates instantly (present/absent counts, lists, dashboard cards).

3. Admin management
   - CRUD for students, classrooms, subjects, timetables, and templates via mutations.
   - Role checks ensure only admins/teachers access these actions.

4. Reporting & exports
   - Aggregations by date/class/student via query functions.
   - Client offers CSV/printable exports; templates can be rasterized (e.g., with html2canvas) for PNG/PDF.

---

### 3) Data model (conceptual)

- tenants: { id, name, settings }
- users: { id, email, tenantId, roles[] }
- students: { id, tenantId, name, rollNo, meta }
- classrooms: { id, tenantId, name }
- subjects: { id, tenantId, name, code }
- timetable: { id, tenantId, classroomId, subjectId, date, startTime, endTime }
- attendance: { id, tenantId, studentId, timetableId, status, markedAt }
- templates: { id, tenantId, name, config }

Indexes typically include: tenantId, date fields, studentId, timetableId to support high‑cardinality queries and fast filters.

Idempotency: attendance unique on (tenantId, studentId, timetableId) to prevent duplicate scans.

---

### 4) Security model

- Authentication: Email OTP with server‑verified codes; on success, the session contains claims (userId, tenantId, roles).
- Authorization: Central guard enforces role capabilities (admin, teacher, student) before any function accesses data.
- Tenant isolation: Every query/mutation requires tenantId and filters all reads/writes to that tenant.
- Input validation: Server validates payloads for required IDs, time windows, and entity relationships.
- Output safety: Template/HTML features sanitized before rendering; only necessary fields returned to clients.

Threat mitigations:
- Duplicate attendance: idempotent writes with unique key.
- Time spoofing: server‑side timestamps are authoritative; client timestamps treated as hints.
- Insecure refs: server checks referential integrity for timetable/subject/classroom/student.

---

### 5) Real‑time & consistency

- Convex queries are reactive: any write that changes their result triggers re‑computation and push to subscribers.
- Functions are atomic: each mutation runs to completion or not at all; no partial writes.
- Optimistic UI: client may show provisional states; server confirmation reconciles to source of truth.

---

### 6) Performance & reliability

- Indexed lookups on tenantId, dates, and join keys (studentId, timetableId).
- Minimal payloads over the wire; client selectors are memoized where relevant.
- Early exits: server validates role/tenant first to fail fast.
- Batching: list/detail queries avoid N+1 by fetching in structured passes.
- Retry/Idempotency: duplicate scans are rejected; transient errors prompt client retry.

---

### 7) Error handling & DX

- Client error boundaries protect the app shell; user‑facing errors presented via toasts.
- Server returns structured errors (permission, validation, not‑found, duplicate) for actionable UX.
- Type‑safe APIs: generated client from Convex keeps requests/responses strongly typed end‑to‑end.

---

### 8) Deployment & configuration

- Frontend: built with Vite, deployed to a static host (e.g., Vercel). Environment variables configured for Convex URL/keys.
- Backend: Convex hosts functions and data; indexes and backups managed by the platform.
- Multi‑environment: separate projects/branches can point to different Convex deployments.

---

### 9) Trade‑offs & rationale (Convex vs SQL/Mongo)

- Pros: built‑in real‑time, atomic functions, typed client, reduced boilerplate, and managed ops.
- Cons: less control over raw queries/indexing semantics, vendor lock‑in, and potential cost/scale trade‑offs at extreme volumes.
- Fit: excellent for collaborative/real‑time dashboards and small teams optimizing for speed and safety.

---

### 10) Interview‑ready Q&A

Q: How do you enforce tenant isolation?
- TenantId exists in session claims and is required for all reads/writes. Guards ensure role + tenant checks run before data access, and every query filters by tenantId.

Q: How do you prevent duplicate attendance?
- An idempotency key on (tenantId, studentId, timetableId) plus server‑side time window checks; duplicates are rejected.

Q: How is real‑time achieved without polling?
- Convex queries are reactive; writes invalidate and recompute results server‑side, which are pushed to connected clients via the generated client.

Q: What’s your failure strategy during scanning?
- Optimistic update with a pending state; the server confirms and the UI reconciles. Failures show specific reasons (permission, time window, duplicate) and allow quick retry.

Q: Where do heavy computations run?
- Aggregations (reports) run server‑side close to data. The client focuses on presentation and export (CSV/print/PNG/PDF via DOM rasterization if needed).

Q: How do you manage roles?
- Centralized mapping of roles → capabilities. Functions declare required capabilities; unauthorized access short‑circuits before any data cost is incurred.

---

### 11) Quick mental model

React components call typed Convex queries/mutations → guard enforces tenant + role → function validates inputs and writes/reads collections → Convex recomputes subscribed queries → UI updates in real time.

---

### 12) Glossary

- Reactive query: a server query whose results are pushed to clients when underlying data changes.
- Idempotent write: multiple identical requests yield a single effect.
- Tenant: an isolated customer space; all data is scoped by tenantId.
- Capability: a permission (e.g., mark_attendance, manage_students) derived from role.

---

### 13) Drag & Design (Template Designer)

How the drag-to-design editor works and why it was challenging:

- Canvas model
  - Elements (text, image, QR, shapes) are absolutely positioned nodes with schema: { id, type, x, y, width, height, rotation, zIndex, props }.
  - Coordinates live in canvas space (not screen pixels) so zoom/export math stays stable.

- Interaction state machine
  - Unified pointer events (mouse/touch/pen). On pointerdown, capture initial positions and active tool (move/resize/rotate).
  - Per frame (requestAnimationFrame), apply deltas from the initial pointer, updating transforms for selected node(s).

- Selection, resize, rotate
  - Single/multi-select with modifier keys. Selection shows 8 resize handles + rotate handle.
  - Resize computes width/height from handle direction; optional aspect-ratio lock with modifier.
  - Rotate uses atan2 around the element center; snapping to e.g. 15° for precision.

- Snapping & alignment
  - Grid snapping for consistent spacing; smart guides compare edges/centers to peers and snap within a threshold.

- Z-order, grouping, bounds
  - zIndex controls draw order; bring-forward/send-backward adjust stacking.
  - Grouping composes parent/child transforms so moving/scaling the group preserves local child coordinates.
  - Clamp positions/sizes to canvas bounds; enforce min sizes to prevent inversion.

- Undo/redo and persistence
  - Reducer applies action patches (add/move/resize/rotate/delete/style). History stores patches for reliable undo/redo.
  - Designer state serializes to JSON (canvas meta + nodes). Templates are versioned and validated when loading.

- Export pipeline
  - Hide editor chrome, wait for images/fonts, rasterize DOM to canvas (e.g., html2canvas), scale to target DPI, output PNG/PDF.

- Performance tactics
  - Re-render only active nodes while dragging; memoize heavy selectors.
  - Hit-testing caches bounding boxes; rotation-aware checks use precomputed cos/sin within a drag session.
  - Throttle guide computations to one per rAF; downsample large image previews.

- Safety & sanitization
  - Whitelist fonts and style ranges; sanitize user text/HTML; validate template JSON against a schema.

- Common issues and fixes
  - Drag “jump” on start → store pointer-to-node offset and apply deltas relative to it.
  - Rotation about wrong origin → standardize math and CSS transform-origin to element center.
  - Resize inversion when crossing axes → clamp min sizes and flip handles appropriately.
  - Pixel drift at non-100% zoom → normalize deltas in canvas coordinates; snap after—not before—rounding.
  - Stuttering from smart guides → compute once per frame and allow a modifier to temporarily disable.
  - Missing assets in export → preload fonts/images and await readiness prior to rasterization.
  - Undo/redo desync → route every transform through the same reducer and patch history.


