# Express Migration — Design Spec

**Date:** 2026-08-24  
**Goal:** Replace raw Node.js `http` module with Express. Same endpoints, same data, idiomatic Express style.

---

## What Changes

| File | Action |
|------|--------|
| `src/server.ts` | Rewrite — Express `app` replaces manual `http.createServer` + URL parsing |
| `src/routes/movies.ts` | Rewrite — Express `Router` + `Request`/`Response` replaces raw `ServerResponse` |
| `src/types.ts` | Unchanged |
| `data/movies.json` | Unchanged |

## New Dependencies

- `express` — HTTP framework
- `@types/express` — TypeScript types for Express

## Architecture

`server.ts` creates an Express `app`, mounts `movieRouter` at `/movies`, adds a 404 catch-all and error middleware. `routes/movies.ts` exports an Express `Router` with two routes.

```
Request
  └── app (express)
        ├── GET /movies        → movieRouter → handleGetMovies
        ├── GET /movies/:id    → movieRouter → handleGetMovieById
        ├── * (unknown route)  → 404 middleware
        └── error              → 500 error middleware
```

## API Endpoints

Same as before — no changes to contract:

| Method | Path | Success | Error |
|--------|------|---------|-------|
| GET | `/movies` | `200` array | `500` |
| GET | `/movies/:id` | `200` object | `404` |

## Key Code Shapes

### src/server.ts
```ts
import express from 'express';
import movieRouter from './routes/movies';

const app = express();
app.use('/movies', movieRouter);
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => res.status(500).json({ error: 'Internal server error' }));
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
```

### src/routes/movies.ts
```ts
import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => { /* return all movies */ });
router.get('/:id', (req, res) => { /* return movie by id or 404 */ });
export default router;
```

## What Express Replaces (learning note)

| Raw http | Express equivalent |
|----------|--------------------|
| `url.match(/^\/movies\/([^/]+)$/)` | `router.get('/:id', ...)` |
| `req.url`, `req.method` manual checks | `app.use('/movies', router)` |
| `res.writeHead(200, {...}); res.end(JSON.stringify(...))` | `res.status(200).json(...)` |
| Manual 404 fallback in if/else | `app.use((req, res) => ...)` |

## Out of Scope

- Changing endpoints or data shape
- Adding new routes
- Middleware beyond 404/500
