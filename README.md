# Subscription Management App

A modern web application for managing subscriptions, tracking spending, and organizing subscription categories.

## Features

- Google Authentication
- Subscription Management
- Category Organization
- Spending Analytics
- Budget Tracking
- Modern UI/UX

## Development

### Prerequisites

- Node.js
- npm
- Firebase account and project

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Authentication Notes

The application uses Firebase Authentication with Google Sign-In. During development, you may notice console warnings about Cross-Origin-Opener-Policy (COOP):

```
Cross-Origin-Opener-Policy policy would block the window.closed call
```

These warnings are expected in the development environment and do not affect functionality. They are related to Firebase's internal popup handling for Google authentication. The authentication flow works correctly despite these warnings.

#### Why We See These Warnings

- Firebase Auth uses popups for Google Sign-In
- Modern browsers implement strict COOP policies
- Development servers often can't match production security headers exactly

#### Important Points

1. These warnings only appear in development console
2. Authentication works correctly
3. User experience is not affected
4. No action is required

If these warnings are particularly bothersome, you can:
- Use Chrome DevTools console filtering to hide them
- Switch to production mode where these warnings typically don't appear

## Tech Stack

- React
- TypeScript
- Firebase (Auth, Firestore)
- Vite
- TailwindCSS

## License

MIT
