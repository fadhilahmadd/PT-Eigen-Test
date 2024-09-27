import { BorrowedBook } from "./borrowed-book.entity";

export interface IBorrowedBookRepository {
    create(borrowedBook: BorrowedBook): Promise<BorrowedBook>;
    findByMemberId(memberId: string): Promise<BorrowedBook[]>;
    findByMemberAndBookId(memberId: string, bookId: string): Promise<BorrowedBook | null>;
    update(id: string, borrowedBook: Partial<BorrowedBook>): Promise<BorrowedBook>;
    findAll(): Promise<BorrowedBook[]>;
}