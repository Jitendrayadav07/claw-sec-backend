# Backend Workflow

Step-by-step workflows for **Registration**, **Login with Google**, and **API key** usage. Each flow is documented in its own file.

---

## Contents

| File | Flow |
|------|------|
| [01-registration.md](./01-registration.md) | Email/password registration |
| [02-login-google.md](./02-login-google.md) | Login with Google (OAuth) |
| [03-api-key.md](./03-api-key.md) | Using the API key on requests |

---

## Flow summary

1. **Register** (email/password) → receive `accessKey`.
2. **Login with Google** → receive or create user → receive `accessKey`.
3. **Call API** → send header `x-clawsec-access-key: <accessKey>` on every request.

All protected APIs use the same access key; no separate session login needed for API calls.
