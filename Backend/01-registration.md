# 1. Registration

Email/password sign-up and how the API key is issued.

---

## Steps

1. Client sends **POST** to the register endpoint with body: `name`, `email`, `password`.
2. Backend validates: all three fields present; password length ≥ 8.
3. Backend checks: email not already in the database.
4. Backend: hash password (e.g. bcrypt), generate a new access key, set default credits.
5. Backend: create user with `name`, `email`, `passwordHash`, `accessKey`, `credits`.
6. Backend responds **201** with `accessKey` and `credits`; client must store the key.

---

## Key points

- **Endpoint:** `POST /api/register` (or your mounted path).
- **Body:** `{ "name", "email", "password" }`.
- **Response:** includes `accessKey` and `credits`; this key is the API key for all later requests.
- No separate “login” for API: having the access key means the user is authenticated for API calls.
