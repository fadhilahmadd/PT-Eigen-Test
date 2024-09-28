import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { BookService } from '../application/book.service';
import { CreateBookDto, UpdateBookDto, BookResponseDto, CheckBookResponseDto } from './dto/book.dto';

@ApiTags('books')
@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Get()
    @ApiOperation({ summary: 'Retrieve all books' })
    @ApiResponse({ status: 200, description: 'List of all books retrieved successfully.', type: [BookResponseDto] })
    async getAllBooks(): Promise<BookResponseDto[]> {
        return this.bookService.getAllBooks();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a book by ID' })
    @ApiParam({ name: 'id', type: 'string', example: '098f6bcd-xxx' })
    @ApiResponse({ status: 200, description: 'Book details retrieved successfully.', type: BookResponseDto })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async getBookById(@Param('id') id: string): Promise<BookResponseDto> {
        return this.bookService.getBookById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new book' })
    @ApiBody({ type: CreateBookDto })
    @ApiResponse({ status: 201, description: 'Book created successfully.', type: BookResponseDto })
    @HttpCode(HttpStatus.CREATED)
    async createBook(@Body() createBookDto: CreateBookDto): Promise<BookResponseDto> {
        return this.bookService.createBook(createBookDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a book' })
    @ApiParam({ name: 'id', type: 'string', example: '098f6bcd-xxx' })
    @ApiBody({ type: UpdateBookDto })
    @ApiResponse({ status: 200, description: 'Book updated successfully.', type: BookResponseDto })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async updateBook(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): Promise<BookResponseDto> {
        return this.bookService.updateBook(id, updateBookDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a book' })
    @ApiParam({ name: 'id', type: 'string', example: '098f6bcd-xxx' })
    @ApiResponse({ status: 204, description: 'Book deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBook(@Param('id') id: string): Promise<void> {
        await this.bookService.deleteBook(id);
    }

    @Get('check')
    @ApiOperation({ summary: 'Check books\' availability status' })
    @ApiResponse({ status: 200, description: 'Books\' availability status retrieved successfully.', type: [CheckBookResponseDto] })
    async checkBooks(): Promise<CheckBookResponseDto[]> {
        return this.bookService.checkBooks();
    }
}