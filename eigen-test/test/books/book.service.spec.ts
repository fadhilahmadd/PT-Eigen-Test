import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from '../../src/books/application/book.service';
import { IBookRepository } from '../../src/books/domain/book.repository.interface';
import { Book } from '../../src/books/domain/book.entity';
import { NotFoundException } from '@nestjs/common';
import { BorrowedBook } from 'src/borrowed-books/domain/borrowed-book.entity';
import { IBorrowedBookRepository } from 'src/borrowed-books/domain/borrowed-book.repository.interface';

describe('BookService', () => {
  let service: BookService;
  let mockRepository: jest.Mocked<IBookRepository>;
  let mockBookRepository: jest.Mocked<IBookRepository>;
  let mockBorrowedBookRepository: jest.Mocked<IBorrowedBookRepository>;

  beforeEach(async () => {
    mockBookRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IBookRepository>;
    
    mockBorrowedBookRepository = {
      findAll: jest.fn(),
    } as any;

    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: 'IBookRepository', useValue: mockBookRepository },
        { provide: 'IBorrowedBookRepository', useValue: mockBorrowedBookRepository },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('seharusnya didefinisikan', () => {
    expect(service).toBeDefined();
  });

  describe('getAllBooks', () => {
    it('seharusnya mengembalikan array buku', async () => {
      const mockBook = new Book();
      mockBook.id = '1';
      mockBook.code = 'B001';
      mockBook.title = 'Sample Book';
      mockBook.author = 'John Doe';
      mockBook.stock = 10;
      const result: Book[] = [mockBook];
      mockBookRepository.findAll.mockResolvedValue(result);
      expect(await service.getAllBooks()).toEqual(result);
    });
  });
  
  describe('getBookById', () => {
    it('seharusnya mengembalikan buku jika ditemukan', async () => {
      const mockBook = new Book();
      mockBook.id = '1';
      mockBook.code = 'B001';
      mockBook.title = 'Sample Book';
      mockBook.author = 'John Doe';
      mockBook.stock = 10;
      mockBookRepository.findById.mockResolvedValue(mockBook);
      expect(await service.getBookById('1')).toEqual(mockBook);
    });
  
    it('seharusnya melempar NotFoundException jika buku tidak ditemukan', async () => {
      mockBookRepository.findById.mockResolvedValue(null);
      await expect(service.getBookById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getBookById', () => {
    it('seharusnya mengembalikan buku jika ditemukan', async () => {
      const mockBook = new Book();
      mockBook.id = '1';
      mockBook.code = 'B001';
      mockBook.title = 'Sample Book';
      mockBook.author = 'John Doe';
      mockBook.stock = 10;
      mockRepository.findById.mockResolvedValue(mockBook);
      expect(await service.getBookById('1')).toBe(mockBook);
    });

    it('seharusnya melempar NotFoundException jika buku tidak ditemukan', async () => {
      mockRepository.findById.mockRejectedValue(new NotFoundException());
      await expect(service.getBookById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkBooks', () => {
    it('seharusnya mengembalikan daftar buku dengan jumlah total dan yang tersedia', async () => {
      const mockBooks = [
        { id: '1', title: 'Book 1', stock: 5 },
        { id: '2', title: 'Book 2', stock: 3 },
      ];
      const mockBorrowedBooks = [
        { bookId: '1', returnDate: null },
        { bookId: '1', returnDate: null },
        { bookId: '2', returnDate: null },
      ];
  
      mockBookRepository.findAll.mockResolvedValue(mockBooks as Book[]);
      mockBorrowedBookRepository.findAll.mockResolvedValue(mockBorrowedBooks as unknown as BorrowedBook[]);
  
      const result = await service.checkBooks();
  
      expect(result).toEqual([
        { id: '1', title: 'Book 1', totalQuantity: 5, availableQuantity: 3 },
        { id: '2', title: 'Book 2', totalQuantity: 3, availableQuantity: 2 },
      ]);
    });
  
    it('seharusnya mengembalikan jumlah yang tersedia sama dengan total jika tidak ada buku yang dipinjam', async () => {
      const mockBooks = [
        { id: '1', title: 'Book 1', stock: 5 },
      ];
      const mockBorrowedBooks: BorrowedBook[] = [];
  
      mockBookRepository.findAll.mockResolvedValue(mockBooks as Book[]);
      mockBorrowedBookRepository.findAll.mockResolvedValue(mockBorrowedBooks);
  
      const result = await service.checkBooks();
  
      expect(result).toEqual([
        { id: '1', title: 'Book 1', totalQuantity: 5, availableQuantity: 5 },
      ]);
    });
  
    it('seharusnya tidak menghitung buku yang sudah dikembalikan', async () => {
      const mockBooks = [
        { id: '1', title: 'Book 1', stock: 5 },
      ];
      const mockBorrowedBooks = [
        { bookId: '1', returnDate: null },
        { bookId: '1', returnDate: new Date() }, // This book has been returned
      ];
  
      mockBookRepository.findAll.mockResolvedValue(mockBooks as Book[]);
      mockBorrowedBookRepository.findAll.mockResolvedValue(mockBorrowedBooks as BorrowedBook[]);
  
      const result = await service.checkBooks();
  
      expect(result).toEqual([
        { id: '1', title: 'Book 1', totalQuantity: 5, availableQuantity: 4 },
      ]);
    });
  });
});
