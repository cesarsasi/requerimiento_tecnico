import { AppDataSource } from '../config/database';
import { User } from '../models/userModel';
import { Repository } from 'typeorm';

const userRepository: Repository<User> = AppDataSource.getRepository(User);

const hashPassword = (password: string): string => {
    return password + '_hashed';
};

async function createUsers() {
    const users: User[] = Array.from({ length: 250 }, (_, i) => {
        const user = new User();
        if (i === 0) {
            user.email = 'admin@eclass.com';
            user.name = 'admin';
            user.password = 'PassWord123&';
            user.role = 'admin';
        }else if (i === 1)  {
            user.email = 'alumno1@eclass.com';
            user.name = 'alumno1';
            user.password = 'PassWord123&';
            user.role = 'alumno';
        
        } else {
            const userIndex = i;
            user.email = `alumno${userIndex}@eclass.com`;
            user.name = `alumno${userIndex}`;
            user.password = hashPassword(`password${userIndex}`);
            user.role = 'alumno';
        }
        return user;
    });
    return  users
}

async function seedUsers(): Promise<void> {
    const users = await createUsers()
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.save(users);
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

export default seedUsers;
