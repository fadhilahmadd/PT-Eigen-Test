import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../domain/book.entity';
import { IBookRepository } from '../domain/book.repository.interface';

@Injectable()
export class BookRepository implements IBookRepository {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
    ) { }

    async findAll(): Promise<Book[]> {
        return this.bookRepository.find();
    }

    async findById(id: string): Promise<Book> {
        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new NotFoundException(`Buku dengan ID "${id}" tidak ditemukan`);
        }
        return book;
    }

    async create(book: Book): Promise<Book> {
        return this.bookRepository.save(book);
    }

    async update(id: string, bookData: Partial<Book>): Promise<Book> {
        const updateResult = await this.bookRepository.update(id, bookData);
        if (updateResult.affected === 0) {
            throw new NotFoundException(`Buku dengan ID "${id}" tidak ditemukan`);
        }
        return this.findById(id);
    }

    async delete(id: string): Promise<void> {
        const result = await this.bookRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Buku dengan ID "${id}" tidak ditemukan`);
        }
    }
}