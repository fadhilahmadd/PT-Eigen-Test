import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('members')
export class Member {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column({ default: false })
    isPenalized: boolean;

    @Column({ nullable: true })
    penaltyEndDate: Date;
}