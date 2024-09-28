import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MemberService } from '../application/member.service';
import { CreateMemberDto, UpdateMemberDto, MemberResponseDto, CheckMemberResponseDto } from './dto/member.dto';

@ApiTags('members')
@Controller('members')
export class MemberController {
    constructor(private readonly memberService: MemberService) { }

    @Get()
    @ApiOperation({ summary: 'Retrieve all members' })
    @ApiResponse({ status: 200, description: 'List of all members retrieved successfully.', type: [MemberResponseDto] })
    async getAllMembers(): Promise<MemberResponseDto[]> {
        return this.memberService.getAllMembers();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a member by ID' })
    @ApiParam({ name: 'id', type: 'string', example: '123e4567-xxx' })
    @ApiResponse({ status: 200, description: 'Member details retrieved successfully.', type: MemberResponseDto })
    @ApiResponse({ status: 404, description: 'Member not found.' })
    async getMemberById(@Param('id') id: string): Promise<MemberResponseDto> {
        return this.memberService.getMemberById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new member' })
    @ApiBody({ type: CreateMemberDto })
    @ApiResponse({ status: 201, description: 'Member created successfully.', type: MemberResponseDto })
    @HttpCode(HttpStatus.CREATED)
    async createMember(@Body() createMemberDto: CreateMemberDto): Promise<MemberResponseDto> {
        return this.memberService.createMember(createMemberDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a member' })
    @ApiParam({ name: 'id', type: 'string', example: '123e4567-xxx' })
    @ApiBody({ type: UpdateMemberDto })
    @ApiResponse({ status: 200, description: 'Member updated successfully.', type: MemberResponseDto })
    @ApiResponse({ status: 404, description: 'Member not found.' })
    async updateMember(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto): Promise<MemberResponseDto> {
        return this.memberService.updateMember(id, updateMemberDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a member' })
    @ApiParam({ name: 'id', type: 'string', example: '123e4567-xxx' })
    @ApiResponse({ status: 204, description: 'Member deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Member not found.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteMember(@Param('id') id: string): Promise<void> {
        await this.memberService.deleteMember(id);
    }

    @Post('borrow/:memberId/:bookId')
    @ApiOperation({ summary: 'Borrow a book for a member' })
    @ApiParam({ name: 'memberId', type: 'string', example: '123e4567-xxx' })
    @ApiParam({ name: 'bookId', type: 'string', example: '098f6bcd-xxx' })
    @ApiResponse({ status: 201, description: 'Book borrowed successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request: Member is penalized, has already borrowed 2 books, or the book is not available.' })
    @ApiResponse({ status: 404, description: 'Member or book not found.' })
    async borrowBook(@Param('memberId') memberId: string, @Param('bookId') bookId: string): Promise<void> {
        await this.memberService.borrowBook(memberId, bookId);
    }

    @Post('return/:memberId/:bookId')
    @ApiOperation({ summary: 'Return a borrowed book' })
    @ApiParam({ name: 'memberId', type: 'string', example: '123e4567-xxx' })
    @ApiParam({ name: 'bookId', type: 'string', example: '098f6bcd-xxx' })
    @ApiResponse({ status: 200, description: 'Book returned successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request: Book was not borrowed by this member.' })
    @ApiResponse({ status: 404, description: 'Member or book not found.' })
    async returnBook(@Param('memberId') memberId: string, @Param('bookId') bookId: string): Promise<void> {
        await this.memberService.returnBook(memberId, bookId);
    }

    @Get('check')
    @ApiOperation({ summary: 'Check all members\' borrowing status' })
    @ApiResponse({ status: 200, description: 'Members\' borrowing status retrieved successfully.', type: [CheckMemberResponseDto] })
    async checkMembers(): Promise<CheckMemberResponseDto[]> {
        return this.memberService.checkMembers();
    }

    @Get('check/:id')
    @ApiOperation({ summary: 'Check a specific member\'s borrowing status' })
    @ApiParam({ name: 'id', type: 'string', example: '123e4567-xxx' })
    @ApiResponse({ status: 200, description: 'Member\'s borrowing status retrieved successfully.', type: CheckMemberResponseDto })
    @ApiResponse({ status: 404, description: 'Member not found.' })
    async checkMemberById(@Param('id') id: string): Promise<CheckMemberResponseDto> {
        return this.memberService.checkMemberById(id);
    }
}