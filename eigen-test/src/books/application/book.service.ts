import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Book } from '../domain/book.entity';
import { IBookRepository } from '../domain/book.repository.interface';
import { IBorrowedBookRepository } from 'src/borrowed-books/domain/borrowed-book.repository.interface';

@Injectable()
export class BookService {
    constructor(
        @Inject('IBookRepository')
        private bookRepository: IBookRepository,
        @Inject('IBorrowedBookRepository')
        private borrowedBookRepository: IBorrowedBookRepository
    ) { }

    async getAllBooks(): Promise<Book[]> {
        return this.bookRepository.findAll();
    }

    async getBookById(id: string): Promise<Book> {
        try {
            return await this.bookRepository.findById(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`Buku dengan ID "${id}" tidak ditemukan`);
            }
            throw error;
        }
    }

    async createBook(bookData: Partial<Book>): Promise<Book> {
        const book = new Book();
        Object.assign(book, bookData);
        return this.bookRepository.create(book);
    }

    async updateBook(id: string, bookData: Partial<Book>): Promise<Book> {
        try {
            return await this.bookRepository.update(id, bookData);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`Buku dengan ID "${id}" tidak ditemukan`);
            }
            throw error;
        }
    }

    async deleteBook(id: string): Promise<void> {
        try {
            await this.bookRepository.delete(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`Buku dengan ID "${id}" tidak ditemukan`);
            }
            throw error;
        }
    }

    async checkBooks(): Promise<{ id: string; title: string; totalQuantity: number; availableQuantity: number }[]> {
        const books = await this.bookRepository.findAll();
        const borrowedBooks = await this.borrowedBookRepository.findAll();

        return Promise.all(books.map(async (book) => {
            const borrowedCount = borrowedBooks.filter(bb => bb.bookId === book.id && !bb.returnDate).length;
            return {
                id: book.id,
                title: book.title,
                totalQuantity: book.stock,
                availableQuantity: book.stock - borrowedCount
            };
        }));
    }
}