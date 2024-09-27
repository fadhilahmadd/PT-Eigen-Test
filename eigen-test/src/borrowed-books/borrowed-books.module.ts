import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowedBook } from './domain/borrowed-book.entity';
import { BorrowedBookRepository } from './infrastructure/borrowed-book.repository';

@Module({
    imports: [TypeOrmModule.forFeature([BorrowedBook])],
    providers: [
        {
            provide: 'IBorrowedBookRepository',
            useClass: BorrowedBookRepository,
        },
    ],
    exports: ['IBorrowedBookRepository'],
})
export class BorrowedBooksModule { }