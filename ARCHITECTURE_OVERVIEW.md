# HashGuard Architecture Overview

HashGuard is a forensic evidence logging system built with a React Native (Expo) frontend and a Node.js (Express) backend. It ensures data integrity and forensic audit trails for evidence management.

## Tech Stack

### Frontend
- **Framework**: React Native (Expo SDK 54)
- **Navigation**: Expo Router (File-based routing)
- **State Management**: React Context API (`AuthContext`, `CaseContext`, `UserContext`)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: Lucide React Native
- **Storage**: Expo SecureStore (for JWT and user sessions)
- **Networking**: Axios with custom interceptors for auth and error handling.

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt (password hashing)
- **File Handling**: Multer (disk storage in `uploads/`)
- **Validation**: Express Validator
- **Middleware**: Helmet (security), CORS.

## Core Workflows

### 1. Authentication & Security
- Users log in via `/api/auth/login`.
- A JWT is returned and stored in `SecureStore` on the mobile device.
- Axios request interceptors automatically attach the `Authorization` header.
- Axios response interceptors watch for `401/403` errors. If a token expires, an event is emitted (`authEvents`), which triggers `AuthContext` to clear the session and `RootLayout` to redirect to Login.

### 2. Evidence Logging
- Evidence is always associated with a **Case**.
- The `LogEvidenceModal` handles file selection (images or documents) and metadata input.
- File uploads are sent as `multipart/form-data` to `/api/evidence`.
- The backend automatically generates an `evidenceId` and logs the "Secured" action in the audit trail.

### 3. Forensic Auditing
- Every major action (Case Created, Evidence Secured, Case Archived) is recorded in the `Log` collection in MongoDB.
- Audit logs are accessible via `/api/logs` (global) or `/api/logs/case/:caseId` (case-specific).
- Login attempts are tracked in a separate `LoginLog` collection.

### 4. Navigation Structure
- `app/(auth)/login.tsx`: Entry point for unauthenticated users.
- `app/(tabs)/home.tsx`: Dashboard with summary statistics and quick actions.
- `app/(tabs)/cases.tsx`: List and management of active/archived cases.
- `app/(tabs)/evidence_tab.tsx`: A "Vault" view showing all secured evidence across all cases.
- `app/(tabs)/settings.tsx`: User profile and application configuration.
- `app/evidence/[id].tsx`: Detailed view for a specific piece of evidence.
- `app/report.tsx`: Generates forensic reports (modal).

## Data Models

### User
- `username`, `email`, `password`, `clearance` (Clearance levels for access control).

### Case
- `caseId` (e.g., CASE-001), `title`, `status` (Active/Archived), `investigator`.

### Evidence
- `evidenceId`, `caseId`, `title`, `type`, `location`, `hashSHA256`, `fileName`, `filePath`, `uploadedBy`.

### Log (Audit Trail)
- `action`, `target`, `caseId`, `type`, `status`, `performedBy`, `timestamp`.
