# Backend Workflow

All backend code lives in the **`Backend`** folder.

## Run the app

```bash
cd Backend
npm install   # if not already done
node index.js
```

Or with nodemon:

```bash
cd Backend
npx nodemon index.js
```

Server runs at `http://localhost:5001` (or `PORT` from `.env`).

- API base: `http://localhost:5001/api`
- Swagger: `http://localhost:5001/api-docs`
- Google login test: `http://localhost:5001/google-login.html`
