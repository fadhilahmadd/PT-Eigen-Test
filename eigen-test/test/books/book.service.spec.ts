import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from '../../src/books/application/book.service';
import { IBookRepository } from '../../src/books/domain/book.repository.interface';
import { Book } from '../../src/books/domain/book.entity';
import { NotFoundException } from '@nestjs/common';
import { BorrowedBook } from 'src/borrowed-books/domain/borrowed-book.entity';
import { IBorrowedBookRepository } from 'src/borrowed-books/domain/borrowed-book.repository.interface';

describe('BookService', () => {
  let service: BookService;
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
      mockBook.code = 'JK-45';
      mockBook.title = 'Harry Potter';
      mockBook.author = 'J.K Rowling';
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
      mockBook.code = 'JK-45';
      mockBook.title = 'Harry Potter';
      mockBook.author = 'J.K Rowling';
      mockBook.stock = 10;
      mockBookRepository.findById.mockResolvedValue(mockBook);
      expect(await service.getBookById('1')).toEqual(mockBook);
    });
  
    it('seharusnya melempar NotFoundException jika buku tidak ditemukan', async () => {
      mockBookRepository.findById.mockRejectedValue(new NotFoundException('Buku dengan ID "1" tidak ditemukan'));
      await expect(service.getBookById('1')).rejects.toThrow(NotFoundException);
    });
  });


  describe('getBookById', () => {
    it('seharusnya mengembalikan buku jika ditemukan', async () => {
      const mockBook = new Book();
      mockBook.id = '1';
      mockBook.code = 'JK-45';
      mockBook.title = 'Harry Potter';
      mockBook.author = 'J.K Rowling';
      mockBook.stock = 10;
      mockBookRepository.findById.mockResolvedValue(mockBook);
      expect(await service.getBookById('1')).toBe(mockBook);
    });

    it('seharusnya melempar NotFoundException jika buku tidak ditemukan', async () => {
      mockBookRepository.findById.mockRejectedValue(new NotFoundException());
      await expect(service.getBookById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkBooks', () => {
    it('seharusnya mengembalikan daftar buku dengan jumlah total dan yang tersedia', async () => {
      const mockBooks = [
        { id: '1', code: "JK-45", title: "Harry Potter", author: "J.K Rowling", stock: 1 },
        { id: '2', code: "SHR-1", title: "A Study in Scarlet", author: "Arthur Conan Doyle", stock: 1 },
      ];
      const mockBorrowedBooks = [
        { bookId: '1', returnDate: null },
      ];
  
      mockBookRepository.findAll.mockResolvedValue(mockBooks as Book[]);
      mockBorrowedBookRepository.findAll.mockResolvedValue(mockBorrowedBooks as unknown as BorrowedBook[]);
  
      const result = await service.checkBooks();
  
      expect(result).toEqual([
        { id: '1', title: "Harry Potter", totalQuantity: 1, availableQuantity: 0 },
        { id: '2', title: "A Study in Scarlet", totalQuantity: 1, availableQuantity: 1 },
      ]);
    });
  
    it('seharusnya mengembalikan jumlah yang tersedia sama dengan total jika tidak ada buku yang dipinjam', async () => {
      const mockBooks = [
        { id: '3', code: "TW-11", title: "Twilight", author: "Stephenie Meyer", stock: 1 },
      ];
      const mockBorrowedBooks: BorrowedBook[] = [];
  
      mockBookRepository.findAll.mockResolvedValue(mockBooks as Book[]);
      mockBorrowedBookRepository.findAll.mockResolvedValue(mockBorrowedBooks);
  
      const result = await service.checkBooks();
  
      expect(result).toEqual([
        { id: '3', title: "Twilight", totalQuantity: 1, availableQuantity: 1 },
      ]);
    });
  
    it('seharusnya tidak menghitung buku yang sudah dikembalikan', async () => {
      const mockBooks = [
        { id: '4', code: "HOB-83", title: "The Hobbit, or There and Back Again", author: "J.R.R. Tolkien", stock: 1 },
      ];
      const mockBorrowedBooks = [
        { bookId: '4', returnDate: null },
        { bookId: '4', returnDate: new Date() },
      ];
  
      mockBookRepository.findAll.mockResolvedValue(mockBooks as Book[]);
      mockBorrowedBookRepository.findAll.mockResolvedValue(mockBorrowedBooks as BorrowedBook[]);
  
      const result = await service.checkBooks();
  
      expect(result).toEqual([
        { id: '4', title: "The Hobbit, or There and Back Again", totalQuantity: 1, availableQuantity: 0 },
      ]);
    });
  });
});
