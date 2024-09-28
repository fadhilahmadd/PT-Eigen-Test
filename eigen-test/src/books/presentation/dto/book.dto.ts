import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
    @ApiProperty({ example: 'JK-45', description: 'Code of the book' })
    code: string;

    @ApiProperty({ example: 'Harry Potter', description: 'Title of the book' })
    title: string;

    @ApiProperty({ example: 'J.K. Rowling', description: 'Author of the book' })
    author: string;

    @ApiProperty({ example: 5, description: 'Stock quantity of the book' })
    stock: number;
}

export class UpdateBookDto {
    @ApiProperty({ example: 'JK-45', description: 'Code of the book', required: false })
    code?: string;

    @ApiProperty({ example: 'Harry Potter', description: 'Title of the book', required: false })
    title?: string;

    @ApiProperty({ example: 'J.K. Rowling', description: 'Author of the book', required: false })
    author?: string;

    @ApiProperty({ example: 5, description: 'Stock quantity of the book', required: false })
    stock?: number;
}

export class BookResponseDto {
    @ApiProperty({ example: '1', description: 'ID of the book' })
    id: string;

    @ApiProperty({ example: 'JK-45', description: 'Code of the book' })
    code: string;

    @ApiProperty({ example: 'Harry Potter', description: 'Title of the book' })
    title: string;

    @ApiProperty({ example: 'J.K. Rowling', description: 'Author of the book' })
    author: string;

    @ApiProperty({ example: 5, description: 'Stock quantity of the book' })
    stock: number;
}

export class CheckBookResponseDto {
    @ApiProperty({ example: '1', description: 'ID of the book' })
    id: string;

    @ApiProperty({ example: 'Harry Potter', description: 'Title of the book' })
    title: string;

    @ApiProperty({ example: 5, description: 'Total quantity of the book' })
    totalQuantity: number;

    @ApiProperty({ example: 3, description: 'Available quantity of the book' })
    availableQuantity: number;
}