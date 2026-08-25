# Movie List API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local REST API in raw Node.js + TypeScript that returns a list of movies from a JSON file.

**Architecture:** Raw Node.js `http` module handles requests in `server.ts`. Route logic lives in `src/routes/movies.ts`. Movie data is read from `data/movies.json` at request time. No framework, no database.

**Tech Stack:** Node.js, TypeScript, `ts-node`, `@types/node`

## Global Constraints

- No Express or any HTTP framework — raw `http` module only
- TypeScript strict mode
- Port: `3000`
- All responses: `Content-Type: application/json`
- Movie shape: `{ id: string, name: string, description: string, imageUrl: string }`

---

### Task 1: Project scaffolding — package.json, tsconfig.json, .gitignore

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Interfaces:**
- Produces: `npm run dev` starts the server via `ts-node`

- [ ] **Step 1: Initialize package.json**

Run from `/Users/apple/Desktop/node-learning`:
```bash
npm init -y
```

- [ ] **Step 2: Install dependencies**

```bash
npm install --save-dev typescript ts-node @types/node
```

- [ ] **Step 3: Add dev script to package.json**

Edit `package.json` — replace the `"scripts"` section:
```json
"scripts": {
  "dev": "ts-node src/server.ts"
}
```

- [ ] **Step 4: Create tsconfig.json**

Create `tsconfig.json` at project root:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create .gitignore**

Create `.gitignore`:
```
node_modules/
dist/
```

- [ ] **Step 6: Verify ts-node works**

```bash
npx ts-node --version
```
Expected: prints a version number like `v10.x.x`

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json .gitignore
git commit -m "chore: scaffold TypeScript project"
```

---

### Task 2: Movie data — types and JSON file

**Files:**
- Create: `src/types.ts`
- Create: `data/movies.json`

**Interfaces:**
- Produces: `Movie` type exported from `src/types.ts`
- Produces: `data/movies.json` — array of 5 movie objects

- [ ] **Step 1: Create src/types.ts**

```bash
mkdir -p src
```

Create `src/types.ts`:
```ts
export type Movie = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};
```

- [ ] **Step 2: Create data/movies.json**

```bash
mkdir -p data
```

Create `data/movies.json`:
```json
[
  {
    "id": "1",
    "name": "The Dark Knight",
    "description": "Batman faces the Joker in Gotham City.",
    "imageUrl": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    "id": "2",
    "name": "Inception",
    "description": "A thief enters dreams to plant an idea.",
    "imageUrl": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
  },
  {
    "id": "3",
    "name": "Interstellar",
    "description": "Astronauts travel through a wormhole to save humanity.",
    "imageUrl": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    "id": "4",
    "name": "The Matrix",
    "description": "A hacker discovers reality is a simulation.",
    "imageUrl": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
  },
  {
    "id": "5",
    "name": "Parasite",
    "description": "A poor family schemes to work for a wealthy household.",
    "imageUrl": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"
  }
]
```

- [ ] **Step 3: Verify JSON is valid**

```bash
node -e "require('./data/movies.json'); console.log('valid')"
```
Expected: `valid`

- [ ] **Step 4: Commit**

```bash
git add src/types.ts data/movies.json
git commit -m "feat: add Movie type and seed data"
```

---

### Task 3: Movie route handlers

**Files:**
- Create: `src/routes/movies.ts`

**Interfaces:**
- Consumes: `Movie` from `src/types.ts`
- Consumes: `data/movies.json` — read with `fs.readFileSync`
- Produces:
  - `handleGetMovies(res: ServerResponse): void`
  - `handleGetMovieById(res: ServerResponse, id: string): void`

- [ ] **Step 1: Create src/routes directory**

```bash
mkdir -p src/routes
```

- [ ] **Step 2: Create src/routes/movies.ts**

```ts
import fs from 'fs';
import path from 'path';
import { ServerResponse } from 'http';
import { Movie } from '../types';

function loadMovies(): Movie[] {
  const filePath = path.join(process.cwd(), 'data', 'movies.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Movie[];
}

function sendJson(res: ServerResponse, statusCode: number, data: unknown): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

export function handleGetMovies(res: ServerResponse): void {
  try {
    const movies = loadMovies();
    sendJson(res, 200, movies);
  } catch {
    sendJson(res, 500, { error: 'Internal server error' });
  }
}

export function handleGetMovieById(res: ServerResponse, id: string): void {
  try {
    const movies = loadMovies();
    const movie = movies.find((m) => m.id === id);
    if (!movie) {
      sendJson(res, 404, { error: 'Movie not found' });
      return;
    }
    sendJson(res, 200, movie);
  } catch {
    sendJson(res, 500, { error: 'Internal server error' });
  }
}
```

- [ ] **Step 3: Type-check the file**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/routes/movies.ts
git commit -m "feat: add movie route handlers"
```

---

### Task 4: HTTP server with routing

**Files:**
- Create: `src/server.ts` (replaces existing `server.js`)

**Interfaces:**
- Consumes: `handleGetMovies`, `handleGetMovieById` from `src/routes/movies.ts`
- Produces: HTTP server on `localhost:3000`

- [ ] **Step 1: Create src/server.ts**

```ts
import http, { IncomingMessage, ServerResponse } from 'http';
import { handleGetMovies, handleGetMovieById } from './routes/movies';

const PORT = 3000;

function sendJson(res: ServerResponse, statusCode: number, data: unknown): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = req.url ?? '';
  const method = req.method ?? '';

  if (method === 'GET' && url === '/movies') {
    handleGetMovies(res);
    return;
  }

  const movieByIdMatch = url.match(/^\/movies\/([^/]+)$/);
  if (method === 'GET' && movieByIdMatch) {
    const id = movieByIdMatch[1];
    handleGetMovieById(res, id);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

- [ ] **Step 2: Type-check everything**

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

- [ ] **Step 4: Test GET /movies in Postman or curl**

```bash
curl http://localhost:3000/movies
```
Expected: JSON array of 5 movies with `id`, `name`, `description`, `imageUrl`.

- [ ] **Step 5: Test GET /movies/:id**

```bash
curl http://localhost:3000/movies/1
```
Expected: single movie object for The Dark Knight.

- [ ] **Step 6: Test unknown route**

```bash
curl http://localhost:3000/unknown
```
Expected: `{"error":"Not found"}` with HTTP 404.

- [ ] **Step 7: Test missing movie ID**

```bash
curl http://localhost:3000/movies/999
```
Expected: `{"error":"Movie not found"}` with HTTP 404.

- [ ] **Step 8: Commit**

```bash
git add src/server.ts
git commit -m "feat: add HTTP server with movie routing"
```

---

### Task 5: Clean up legacy server.js

**Files:**
- Delete: `server.js`

- [ ] **Step 1: Delete server.js**

```bash
rm server.js
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove legacy server.js"
```
