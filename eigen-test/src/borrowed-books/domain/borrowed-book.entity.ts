import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from '../../books/domain/book.entity';
import { Member } from '../../members/domain/member.entity';

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

    @ManyToOne(() => Book)
    @JoinColumn({ name: 'bookId' })
    book: Book;

    @ManyToOne(() => Member)
    @JoinColumn({ name: 'memberId' })
    member: Member;
}