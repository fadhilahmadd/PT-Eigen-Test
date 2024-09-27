import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Member } from '../domain/member.entity';
import { IMemberRepository } from '../domain/member.repository.interface';
import { IBookRepository } from '../../books/domain/book.repository.interface';
import { IBorrowedBookRepository } from '../../borrowed-books/domain/borrowed-book.repository.interface';
import { BorrowedBook } from '../../borrowed-books/domain/borrowed-book.entity';

@Injectable()
export class MemberService {
    constructor(
        @Inject('IMemberRepository')
        private memberRepository: IMemberRepository,
        @Inject('IBookRepository')
        private bookRepository: IBookRepository,
        @Inject('IBorrowedBookRepository')
        private borrowedBookRepository: IBorrowedBookRepository
    ) { }

    async getAllMembers(): Promise<Member[]> {
        return this.memberRepository.findAll();
    }

    async getMemberById(id: string): Promise<Member> {
        try {
            return await this.memberRepository.findById(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`Member dengan ID "${id}" tidak ditemukan`);
            }
            throw error;
        }
    }

    async createMember(memberData: Partial<Member>): Promise<Member> {
        const member = new Member();
        Object.assign(member, memberData);
        return this.memberRepository.create(member);
    }

    async updateMember(id: string, memberData: Partial<Member>): Promise<Member> {
        try {
            return await this.memberRepository.update(id, memberData);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`Member dengan ID "${id}" tidak ditemukan`);
            }
            throw error;
        }
    }

    async deleteMember(id: string): Promise<void> {
        try {
            await this.memberRepository.delete(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`Member with ID "${id}" tidak ditemukan`);
            }
            throw error;
        }
    }

    async borrowBook(memberId: string, bookId: string): Promise<void> {
        const member = await this.memberRepository.findById(memberId);
        const book = await this.bookRepository.findById(bookId);

        if (member.isPenalized) {
            throw new BadRequestException('Member sedang dalam hukuman');
        }

        const borrowedBooks = await this.borrowedBookRepository.findByMemberId(memberId);
        if (borrowedBooks.length >= 2) {
            throw new BadRequestException('Member telah melebihi batas maksimal meminjam buku');
        }

        if (book.stock <= 0) {
            throw new BadRequestException('Buku tidak tersedia');
        }

        const borrowedBook = new BorrowedBook();
        borrowedBook.memberId = memberId;
        borrowedBook.bookId = bookId;
        borrowedBook.borrowDate = new Date();

        await this.borrowedBookRepository.create(borrowedBook);
        await this.bookRepository.update(bookId, { stock: book.stock - 1 });
    }

    async returnBook(memberId: string, bookId: string): Promise<void> {
        const borrowedBook = await this.borrowedBookRepository.findByMemberAndBookId(memberId, bookId);
        if (!borrowedBook) {
            throw new BadRequestException('Member telah meminjam buku tersebut');
        }

        const returnDate = new Date();
        const borrowDuration = returnDate.getTime() - borrowedBook.borrowDate.getTime();
        const borrowDurationInDays = borrowDuration / (1000 * 3600 * 24);

        if (borrowDurationInDays > 7) {
            const member = await this.memberRepository.findById(memberId);
            member.isPenalized = true;
            member.penaltyEndDate = new Date(returnDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
            await this.memberRepository.update(memberId, member);
        }

        borrowedBook.returnDate = returnDate;
        await this.borrowedBookRepository.update(borrowedBook.id, borrowedBook);

        const book = await this.bookRepository.findById(bookId);
        await this.bookRepository.update(bookId, { stock: book.stock + 1 });
    }

    async checkMembers(): Promise<{ id: string; name: string; borrowedBooks: number }[]> {
        const members = await this.memberRepository.findAll();
        const borrowedBooks = await this.borrowedBookRepository.findAll();

        return members.map(member => {
            const borrowedCount = borrowedBooks.filter(bb => bb.memberId === member.id && !bb.returnDate).length;
            return {
                id: member.id,
                name: member.name,
                borrowedBooks: borrowedCount
            };
        });
    }
}