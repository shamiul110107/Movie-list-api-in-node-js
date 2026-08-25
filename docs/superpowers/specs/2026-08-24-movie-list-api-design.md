# Movie List API — Design Spec

**Date:** 2026-08-24  
**Stack:** Node.js + TypeScript, raw `http` module, JSON file data store  
**Audience:** Local dev only — Postman or iOS app as client

---

## Project Structure

```
node-learning/
├── src/
│   ├── server.ts          # HTTP server entry point
│   └── routes/
│       └── movies.ts      # Movie route handlers
├── data/
│   └── movies.json        # Sample movie records
├── package.json
├── tsconfig.json
└── .gitignore
```

## Data Shape

Each movie record in `data/movies.json`:

```json
{
  "id": "1",
  "name": "The Dark Knight",
  "description": "Batman faces the Joker in Gotham City.",
  "imageUrl": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
}
```

TypeScript type:

```ts
type Movie = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};
```

## API Endpoints

| Method | Path          | Success Response         | Error Response                      |
|--------|---------------|--------------------------|-------------------------------------|
| GET    | `/movies`     | `200` — array of movies  | `500` on file read failure          |
| GET    | `/movies/:id` | `200` — single movie     | `404 { "error": "Movie not found" }` |

All responses: `Content-Type: application/json`.

## Routing Logic

`server.ts` parses `req.method` and `req.url`, delegates to `movies.ts` handlers.

- `GET /movies` — reads `movies.json`, returns full array
- `GET /movies/:id` — reads `movies.json`, finds by id, returns match or 404
- Any other path/method — returns `404 { "error": "Not found" }`

## Error Handling

| Scenario             | Status | Body                              |
|----------------------|--------|-----------------------------------|
| Unknown route        | 404    | `{ "error": "Not found" }`        |
| Movie ID not found   | 404    | `{ "error": "Movie not found" }`  |
| Uncaught server error| 500    | `{ "error": "Internal server error" }` |

## Dev Setup

- Run: `npx ts-node src/server.ts`
- Port: `3000`
- Base URL: `http://localhost:3000`

## Out of Scope

- Authentication
- POST / PUT / DELETE endpoints
- Database
- Deployment
