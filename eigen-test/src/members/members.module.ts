import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './presentation/member.controller';
import { MemberService } from './application/member.service';
import { MemberRepository } from './infrastructure/member.repository';
import { Member } from './domain/member.entity';
import { BooksModule } from 'src/books/books.module';
import { BorrowedBooksModule } from 'src/borrowed-books/borrowed-books.module';

@Module({
    imports: [TypeOrmModule.forFeature([Member]),
    BooksModule,
    BorrowedBooksModule,
],
    controllers: [MemberController],
    providers: [
        MemberService,
        {
            provide: 'IMemberRepository',
            useClass: MemberRepository,
        },
    ],
})
export class MembersModule { }