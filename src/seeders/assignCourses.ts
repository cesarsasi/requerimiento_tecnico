import { AppDataSource } from '../config/database';
import { QueryRunner } from 'typeorm';

type UserCourse = {
    user_id: number;
    course_id: number;
};

async function assignCourses() {
    const relations: UserCourse[] = Array.from({ length: 90 }, (_,i) => {
        const relation: UserCourse = {
            user_id: 91-i,
            course_id: 1+i,
        };
        return relation;
    });
    return relations;
}

async function seedAssignCourses(): Promise<void> {
    const assigCourses = await assignCourses()
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
        await queryRunner.manager.createQueryBuilder()
            .insert()
            .into('user_courses') // Nombre de la tabla intermedia
            .values(assigCourses)
            .execute();
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

export default seedAssignCourses;