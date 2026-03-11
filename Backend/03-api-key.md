# 3. API key

How the client uses the access key to call protected APIs.

---

## Steps

1. Client obtains the **access key** once (from register response or from Google login callback).
2. Client stores it securely (e.g. env var, secure storage).
3. For every request to protected APIs, client sends the header: **`x-clawsec-access-key: <accessKey>`**.
4. Backend `validateAccessKey` middleware looks up user by `accessKey`, attaches `req.user`; protected routes use `req.user` and credits.

---

## Key points

- **Header name:** `x-clawsec-access-key`.
- **Value:** the 64-character hex access key returned at registration or after Google login.
- No separate “login” call for API: the access key in the header is the authentication.
- **Protected routes:** e.g. `/api/workspace/skills`, `/api/audit` (already use `validateAccessKey`).
