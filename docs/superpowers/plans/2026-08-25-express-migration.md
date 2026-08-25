# Express Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace raw Node.js `http` module with Express in the movie list API.

**Architecture:** Install Express, rewrite `src/routes/movies.ts` to use Express `Router` and `Request`/`Response` types, rewrite `src/server.ts` to create an Express app with mounted router and 404/500 middleware. `src/types.ts` and `data/movies.json` are untouched.

**Tech Stack:** Node.js, TypeScript, tsx, Express, @types/express

## Global Constraints

- Same endpoints: `GET /movies` and `GET /movies/:id`
- Same response shapes — no changes to JSON contract
- All responses: `Content-Type: application/json`
- Port: `3000`
- No changes to `src/types.ts` or `data/movies.json`

---

### Task 1: Install Express

**Files:**
- Modify: `package.json` (devDependencies → dependencies)

**Interfaces:**
- Produces: `express` and `@types/express` available to import

- [ ] **Step 1: Install express and its types**

```bash
npm install express
npm install --save-dev @types/express
```

- [ ] **Step 2: Verify installation**

```bash
node -e "require('express'); console.log('express ok')"
```
Expected: `express ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install express"
```

---

### Task 2: Rewrite routes/movies.ts with Express Router

**Files:**
- Modify: `src/routes/movies.ts`

**Interfaces:**
- Consumes: `Movie` from `src/types.ts`
- Consumes: `data/movies.json` via `fs.readFileSync`
- Produces: default export `router` — Express `Router` with `GET /` and `GET /:id`

- [ ] **Step 1: Rewrite src/routes/movies.ts**

Replace entire file content with:

```ts
import fs from 'fs';
import path from 'path';
import { Router, Request, Response } from 'express';
import { Movie } from '../types';

const router = Router();

function loadMovies(): Movie[] {
  const filePath = path.join(process.cwd(), 'data', 'movies.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Movie[];
}

router.get('/', (req: Request, res: Response) => {
  try {
    const movies = loadMovies();
    res.status(200).json(movies);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const movies = loadMovies();
    const movie = movies.find((m) => m.id === req.params.id);
    if (!movie) {
      res.status(404).json({ error: 'Movie not found' });
      return;
    }
    res.status(200).json(movie);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/movies.ts
git commit -m "feat: rewrite movie routes with Express Router"
```

---

### Task 3: Rewrite server.ts with Express app

**Files:**
- Modify: `src/server.ts`

**Interfaces:**
- Consumes: `router` (default export) from `src/routes/movies.ts`
- Produces: Express app listening on port `3000`

- [ ] **Step 1: Rewrite src/server.ts**

Replace entire file content with:

```ts
import express, { Request, Response, NextFunction } from 'express';
import movieRouter from './routes/movies';

const app = express();
const PORT = 3000;

app.use('/movies', movieRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Start server**

```bash
npm run dev
```
Expected output:
```
Server running at http://localhost:3000
```

- [ ] **Step 4: Test GET /movies**

```bash
curl http://localhost:3000/movies
```
Expected: JSON array of 5 movies.

- [ ] **Step 5: Test GET /movies/:id**

```bash
curl http://localhost:3000/movies/2
```
Expected:
```json
{"id":"2","name":"Inception","description":"A thief enters dreams to plant an idea.","imageUrl":"https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"}
```

- [ ] **Step 6: Test unknown route**

```bash
curl http://localhost:3000/unknown
```
Expected: `{"error":"Not found"}`

- [ ] **Step 7: Test missing movie ID**

```bash
curl http://localhost:3000/movies/999
```
Expected: `{"error":"Movie not found"}`

- [ ] **Step 8: Commit**

```bash
git add src/server.ts
git commit -m "feat: rewrite server with Express app"
```
