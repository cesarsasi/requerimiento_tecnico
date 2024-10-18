import { AppDataSource } from '../config/database';
import { Course } from '../models/courseModel';
import { LoremIpsum } from 'lorem-ipsum';

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

function generateLoremIpsum(wordCount: number): string {
    return lorem.generateWords(wordCount);
  }

async function createCourses() {
    const users: Course[] = Array.from({ length: 250 }, (_, i) => {
        const course = new Course();
        const userIndex = i;
        course.name = `Curso lectivo ${generateLoremIpsum(3)} - ${userIndex}`;
        course.description = generateLoremIpsum(30);
        return course;
    });
    return  users
}

async function seedCourses(): Promise<void> {
    const courses = await createCourses();
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const courseRepository = AppDataSource.getRepository(Course);
        await courseRepository.save(courses);
        console.log('Courses have been seeded.');
    } catch (error) {
        console.error('Error seeding courses:', error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

export default seedCourses;
