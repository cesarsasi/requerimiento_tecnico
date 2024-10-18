import { BaseEntity, Column, ManyToMany, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { IsNotEmpty, Length, IsEnum, IsEmail, Matches } from "class-validator";
import { Course } from "../models/courseModel";
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', unique: true })
    @IsEmail({}, { message: 'El email debe ser una dirección válida.' }) 
    @IsNotEmpty({ message: 'El email no puede estar vacío.' })
    email: string;

    @Column({ type: 'text' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres.' })
    name: string;

    @Column({ type: 'text' })
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
    @Length(8, 100, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'La contraseña debe tener al menos 8 caracteres, incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
    })
    password: string;

    @Column({
        type: 'enum',
        enum: ['admin', 'alumno'],
        default: 'alumno'
    })
    @IsEnum(['admin', 'alumno'], { message: 'El rol debe ser "admin" o "alumno".' })
    role: string;

    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    @ManyToMany(() => Course)
    courses: Course[];
}
