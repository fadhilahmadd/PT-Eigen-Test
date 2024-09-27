import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from '../../src/members/application/member.service';
import { IMemberRepository } from '../../src/members/domain/member.repository.interface';
import { IBookRepository } from '../../src/books/domain/book.repository.interface';
import { IBorrowedBookRepository } from '../../src/borrowed-books/domain/borrowed-book.repository.interface';
import { Member } from '../../src/members/domain/member.entity';
import { Book } from '../../src/books/domain/book.entity';
import { BorrowedBook } from '../../src/borrowed-books/domain/borrowed-book.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MemberService', () => {
  let service: MemberService;
  let mockMemberRepository: jest.Mocked<IMemberRepository>;
  let mockBookRepository: jest.Mocked<IBookRepository>;
  let mockBorrowedBookRepository: jest.Mocked<IBorrowedBookRepository>;

  beforeEach(async () => {
    mockMemberRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockBookRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    mockBorrowedBookRepository = {
      create: jest.fn(),
      findByMemberId: jest.fn(),
      findByMemberAndBookId: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(), // Add this line
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: 'IMemberRepository', useValue: mockMemberRepository },
        { provide: 'IBookRepository', useValue: mockBookRepository },
        { provide: 'IBorrowedBookRepository', useValue: mockBorrowedBookRepository },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('seharusnya didefinisikan', () => {
    expect(service).toBeDefined();
  });

  describe('getAllMembers', () => {
    it('seharusnya mengembalikan array anggota', async () => {
      const mockMember = new Member();
      mockMember.id = '1';
      mockMember.code = 'M001';
      mockMember.name = 'John Doe';
      mockMember.isPenalized = false;
      const result: Member[] = [mockMember];
      mockMemberRepository.findAll.mockResolvedValue(result);
      expect(await service.getAllMembers()).toBe(result);
    });
  });

  describe('getMemberById', () => {
    it('seharusnya mengembalikan anggota jika ditemukan', async () => {
      const mockMember = new Member();
      mockMember.id = '1';
      mockMember.code = 'M001';
      mockMember.name = 'John Doe';
      mockMember.isPenalized = false;
      mockMemberRepository.findById.mockResolvedValue(mockMember);
      expect(await service.getMemberById('1')).toBe(mockMember);
    });

    it('seharusnya melempar NotFoundException jika anggota tidak ditemukan', async () => {
      mockMemberRepository.findById.mockRejectedValue(new NotFoundException());
      await expect(service.getMemberById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('borrowBook', () => {
    it('seharusnya mengizinkan anggota meminjam buku', async () => {
        const mockMember = new Member();
        mockMember.id = '1';
        mockMember.isPenalized = false;

        const mockBook = new Book();
        mockBook.id = '1';
        mockBook.stock = 1;

        mockMemberRepository.findById.mockResolvedValue(mockMember);
        mockBookRepository.findById.mockResolvedValue(mockBook);
        mockBorrowedBookRepository.findByMemberId.mockResolvedValue([]);
        mockBorrowedBookRepository.create.mockResolvedValue(new BorrowedBook());

        await expect(service.borrowBook('1', '1')).resolves.not.toThrow();
        expect(mockBookRepository.update).toHaveBeenCalledWith('1', { stock: 0 });
    });

    it('seharusnya melempar BadRequestException jika anggota sedang mendapat penalti', async () => {
      const mockMember = new Member();
      mockMember.id = '1';
      mockMember.isPenalized = true;

      mockMemberRepository.findById.mockResolvedValue(mockMember);

      await expect(service.borrowBook('1', '1')).rejects.toThrow(BadRequestException);
    });

    it('seharusnya melempar BadRequestException jika anggota sudah meminjam 2 buku', async () => {
      const mockMember = new Member();
      mockMember.id = '1';
      mockMember.isPenalized = false;

      mockMemberRepository.findById.mockResolvedValue(mockMember);
      mockBorrowedBookRepository.findByMemberId.mockResolvedValue([new BorrowedBook(), new BorrowedBook()]);

      await expect(service.borrowBook('1', '1')).rejects.toThrow(BadRequestException);
    });

    it('seharusnya melempar BadRequestException jika buku tidak tersedia', async () => {
      const mockMember = new Member();
      mockMember.id = '1';
      mockMember.isPenalized = false;

      const mockBook = new Book();
      mockBook.id = '1';
      mockBook.stock = 0;

      mockMemberRepository.findById.mockResolvedValue(mockMember);
      mockBookRepository.findById.mockResolvedValue(mockBook);
      mockBorrowedBookRepository.findByMemberId.mockResolvedValue([]);

      await expect(service.borrowBook('1', '1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('returnBook', () => {
    it('seharusnya mengizinkan anggota mengembalikan buku', async () => {
        const borrowedBook = new BorrowedBook();
        borrowedBook.id = '1';
        borrowedBook.memberId = '1';
        borrowedBook.bookId = '1';
        borrowedBook.borrowDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 hari yang lalu

        const mockBook = new Book();
        mockBook.id = '1';
        mockBook.stock = 0;

        mockBorrowedBookRepository.findByMemberAndBookId.mockResolvedValue(borrowedBook);
        mockBookRepository.findById.mockResolvedValue(mockBook);

        await expect(service.returnBook('1', '1')).resolves.not.toThrow();
        expect(mockBorrowedBookRepository.update).toHaveBeenCalled();
        expect(mockBookRepository.update).toHaveBeenCalledWith('1', { stock: 1 });
    });

    it('seharusnya memberikan penalti kepada anggota jika buku dikembalikan terlambat', async () => {
      const borrowedBook = new BorrowedBook();
      borrowedBook.id = '1';
      borrowedBook.borrowDate = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000); // 8 hari yang lalu

      const mockMember = new Member();
      mockMember.id = '1';
      mockMember.isPenalized = false;

      const mockBook = new Book();
      mockBook.id = '1';
      mockBook.stock = 0;

      mockBorrowedBookRepository.findByMemberAndBookId.mockResolvedValue(borrowedBook);
      mockMemberRepository.findById.mockResolvedValue(mockMember);
      mockBookRepository.findById.mockResolvedValue(mockBook);

      await expect(service.returnBook('1', '1')).resolves.not.toThrow();
      expect(mockMemberRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({
        isPenalized: true,
        penaltyEndDate: expect.any(Date)
      }));
    });

    it('seharusnya melempar BadRequestException jika buku tidak dipinjam oleh anggota', async () => {
      mockBorrowedBookRepository.findByMemberAndBookId.mockResolvedValue(null);

      await expect(service.returnBook('1', '1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('checkMembers', () => {
    it('seharusnya mengembalikan daftar anggota dengan jumlah buku yang dipinjam', async () => {
      const mockMembers = [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
      ];
      const mockBorrowedBooks = [
        { memberId: '1', returnDate: null },
        { memberId: '1', returnDate: null },
        { memberId: '2', returnDate: null },
      ];

      mockMemberRepository.findAll.mockResolvedValue(mockMembers as Member[]);
      mockBorrowedBookRepository.findAll.mockResolvedValue(mockBorrowedBooks as unknown as BorrowedBook[]);

      const result = await service.checkMembers();

      expect(result).toEqual([
        { id: '1', name: 'John Doe', borrowedBooks: 2 },
        { id: '2', name: 'Jane Smith', borrowedBooks: 1 },
      ]);
    });

    it('seharusnya mengembalikan 0 buku dipinjam jika anggota tidak meminjam buku', async () => {
      const mockMembers = [
        { id: '1', name: 'John Doe' },
      ];
      const mockBorrowedBooks: BorrowedBook[] = [];

      mockMemberRepository.findAll.mockResolvedValue(mockMembers as Member[]);
      mockBorrowedBookRepository.findAll.mockResolvedValue(mockBorrowedBooks);

      const result = await service.checkMembers();

      expect(result).toEqual([
        { id: '1', name: 'John Doe', borrowedBooks: 0 },
      ]);
    });

    it('seharusnya tidak menghitung buku yang sudah dikembalikan', async () => {
      const mockMembers = [
        { id: '1', name: 'John Doe' },
      ];
      const mockBorrowedBooks = [
        { memberId: '1', returnDate: null },
        { memberId: '1', returnDate: new Date() }, // This book has been returned
      ];

      mockMemberRepository.findAll.mockResolvedValue(mockMembers as Member[]);
      mockBorrowedBookRepository.findAll.mockResolvedValue(mockBorrowedBooks as BorrowedBook[]);

      const result = await service.checkMembers();

      expect(result).toEqual([
        { id: '1', name: 'John Doe', borrowedBooks: 1 },
      ]);
    });
  });
  // Uji yang ada untuk createMember, updateMember, dan deleteMember tetap sama
});
