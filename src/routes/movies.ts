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
