import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../domain/member.entity';
import { IMemberRepository } from '../domain/member.repository.interface';

@Injectable()
export class MemberRepository implements IMemberRepository {
    constructor(
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
    ) { }

    async findAll(): Promise<Member[]> {
        return this.memberRepository.find();
    }

    async findById(id: string): Promise<Member> {
        const member = await this.memberRepository.findOne({ where: { id } });
        if (!member) {
            throw new NotFoundException(`Member with ID "${id}" not found`);
        }
        return member;
    }

    async create(member: Member): Promise<Member> {
        return this.memberRepository.save(member);
    }

    async update(id: string, member: Partial<Member>): Promise<Member> {
        await this.memberRepository.update(id, member);
        return this.findById(id);
    }

    async delete(id: string): Promise<void> {
        const result = await this.memberRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Member with ID "${id}" not found`);
        }
    }
}