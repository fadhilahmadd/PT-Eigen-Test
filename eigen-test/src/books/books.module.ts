import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './presentation/book.controller';
import { BookService } from './application/book.service';
import { BookRepository } from './infrastructure/book.repository';
import { Book } from './domain/book.entity';
import { BorrowedBooksModule } from '../borrowed-books/borrowed-books.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Book]),
        BorrowedBooksModule,
    ],
    controllers: [BookController],
    providers: [
        BookService,
        {
            provide: 'IBookRepository',
            useClass: BookRepository,
        },
    ],
    exports: ['IBookRepository', BookService],
})
export class BooksModule { }