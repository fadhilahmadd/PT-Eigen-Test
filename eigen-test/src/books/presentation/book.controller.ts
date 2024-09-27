import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { BookService } from '../application/book.service';
import { Book } from '../domain/book.entity';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Get()
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.getAllBooks();
    }

    @Get(':id')
    async getBookById(@Param('id') id: string): Promise<Book> {
        return this.bookService.getBookById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createBook(@Body() bookData: Partial<Book>): Promise<Book> {
        return this.bookService.createBook(bookData);
    }

    @Put(':id')
    async updateBook(@Param('id') id: string, @Body() bookData: Partial<Book>): Promise<Book> {
        return this.bookService.updateBook(id, bookData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBook(@Param('id') id: string): Promise<void> {
        await this.bookService.deleteBook(id);
    }

    @Get('check')
    async checkBooks(): Promise<{ id: string; title: string; totalQuantity: number; availableQuantity: number }[]> {
        return this.bookService.checkBooks();
    }
}