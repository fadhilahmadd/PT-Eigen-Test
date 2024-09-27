import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MemberService } from '../application/member.service';
import { Member } from '../domain/member.entity';

@Controller('members')
export class MemberController {
    constructor(private readonly memberService: MemberService) { }

    @Get()
    async getAllMembers(): Promise<Member[]> {
        return this.memberService.getAllMembers();
    }

    @Get(':id')
    async getMemberById(@Param('id') id: string): Promise<Member> {
        return this.memberService.getMemberById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createMember(@Body() memberData: Partial<Member>): Promise<Member> {
        return this.memberService.createMember(memberData);
    }

    @Put(':id')
    async updateMember(@Param('id') id: string, @Body() memberData: Partial<Member>): Promise<Member> {
        return this.memberService.updateMember(id, memberData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteMember(@Param('id') id: string): Promise<void> {
        await this.memberService.deleteMember(id);
    }

    @Get('check')
    async checkMembers(): Promise<{ id: string; name: string; borrowedBooks: number }[]> {
        return this.memberService.checkMembers();
    }
}