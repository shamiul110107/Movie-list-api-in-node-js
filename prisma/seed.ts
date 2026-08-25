import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.movie.createMany({
    data: [
      { name: 'The Dark Knight', description: 'Batman faces the Joker in Gotham City.', imageUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
      { name: 'Inception', description: 'A thief enters dreams to plant an idea.', imageUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
      { name: 'Interstellar', description: 'Astronauts travel through a wormhole to save humanity.', imageUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
      { name: 'The Matrix', description: 'A hacker discovers reality is a simulation.', imageUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
      { name: 'Parasite', description: 'A poor family schemes to work for a wealthy household.', imageUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' },
    ],
  });
  console.log('Seeded 5 movies');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
