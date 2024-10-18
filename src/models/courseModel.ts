import { BaseEntity, Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { User } from "../models/userModel";

@Entity('courses')
export class Course extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    @Length(2, 50, { message: "Course name must be between 2 and 50 characters long." })
    @IsNotEmpty({ message: "Course name is required." })
    name: string;

    @Column({ type: 'text', nullable: true })
    @Length(10, 500, { message: "Description must be between 10 and 500 characters long." }) 
    description: string;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'user_courses',
        joinColumn: { name: 'course_id' },
        inverseJoinColumn: { name: 'user_id' }
    })
    users: User[];
}
