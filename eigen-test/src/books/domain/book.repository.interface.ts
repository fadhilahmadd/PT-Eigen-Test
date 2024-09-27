import { Book } from './book.entity';

export interface IBookRepository {
    findAll(): Promise<Book[]>;
    findById(id: string): Promise<Book>;
    create(book: Book): Promise<Book>;
    update(id: string, book: Partial<Book>): Promise<Book>;
    delete(id: string): Promise<void>;
}