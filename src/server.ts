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
