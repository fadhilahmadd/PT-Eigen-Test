import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('borrowed_books')
export class BorrowedBook {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    memberId: string;

    @Column()
    bookId: string;

    @Column()
    borrowDate: Date;

    @Column({ nullable: true })
    returnDate: Date;
}