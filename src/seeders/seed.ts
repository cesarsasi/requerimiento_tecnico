import { AppDataSource } from '../config/database';
import seedUsers from './userSeeder';
import seedCourses from './courseSeeder';
import seedAssignCourses from './assignCourses'

async function runSeeders(): Promise<void> {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        await AppDataSource.synchronize(true);

        await seedUsers();
        await seedCourses();
        await seedAssignCourses();
        console.log('Seeding completed.');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        process.exit();
    }
}

runSeeders();
