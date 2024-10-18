import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/database';

async function main() {
    const PORT: string | number = process.env.PORT || 3000;
    try {
        await AppDataSource.initialize().then(() => {
            console.log('Database connected');
          })
          .catch((err: Error) => {
            console.error('Error connecting to the database', err);
          });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
    }
}

main();
