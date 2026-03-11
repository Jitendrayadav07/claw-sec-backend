# 2. Login with Google

OAuth flow so users can sign in with Google and get an API key.

---

## Steps

1. Create a project in **Google Cloud Console** and enable **Google OAuth** (create OAuth 2.0 Client ID).
2. Get **Client ID** and **Client Secret**; configure authorized redirect URI(s).
3. Add env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and optionally `GOOGLE_REDIRECT_URI`.
4. Install an OAuth library (e.g. `passport` + `passport-google-oauth20`, or Google’s official client).
5. Add a route that redirects the user to Google’s consent URL (client ID, redirect URI, scopes e.g. `email`, `profile`).
6. Add a **callback route** that receives the auth code from Google, exchanges it for tokens, and fetches user profile (email, name).
7. In the callback: look up user by email; if not found, create user (name, email, no/placeholder password, new access key, default credits); if found, use existing user.
8. Return or redirect with the **access key** (and optionally a session/JWT) so the client can call your API.

---

## Key points

- **User model:** `passwordHash` may need to allow null or a placeholder for Google-only users.
- **Same API key:** after “Login with Google,” the client gets an `accessKey` and uses it like after email/password registration.
- **Frontend:** “Sign in with Google” → redirect to your auth URL → backend redirects to Google → user consents → callback → backend creates/finds user and returns access key.
