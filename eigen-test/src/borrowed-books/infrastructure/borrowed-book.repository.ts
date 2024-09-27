import { Injectable } from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BorrowedBook } from '../domain/borrowed-book.entity';
import { IBorrowedBookRepository } from '../../borrowed-books/domain/borrowed-book.repository.interface';

@Injectable()
export class BorrowedBookRepository implements IBorrowedBookRepository {
    constructor(
        @InjectRepository(BorrowedBook)
        private borrowedBookRepository: Repository<BorrowedBook>,
    ) {}

    async create(borrowedBook: BorrowedBook): Promise<BorrowedBook> {
        return this.borrowedBookRepository.save(borrowedBook);
    }

    async findByMemberId(memberId: string): Promise<BorrowedBook[]> {
        return this.borrowedBookRepository.find({
            where: {
                memberId: memberId,
                returnDate: IsNull()
            },
            relations: ['book'],
        });
    }

    async findByMemberAndBookId(memberId: string, bookId: string): Promise<BorrowedBook> {
        const result = await this.borrowedBookRepository.findOne({
            where: {
                memberId: memberId,
                bookId: bookId,
                returnDate: IsNull()
            },
            relations: ['book'],
        });

        if (!result) {
            throw new Error('BorrowedBook not found');
        }

        return result;
    }

    async update(id: string, borrowedBook: Partial<BorrowedBook>): Promise<BorrowedBook> {
        await this.borrowedBookRepository.update(id, borrowedBook);
        const updatedBorrowedBook = await this.borrowedBookRepository.findOne({ where: { id } });
        
        if (!updatedBorrowedBook) {
            throw new Error('BorrowedBook not found after update');
        }

        return updatedBorrowedBook;
    }

    async findAll(): Promise<BorrowedBook[]> {
        return this.borrowedBookRepository.find();
    }
}
