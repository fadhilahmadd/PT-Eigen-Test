import { Member } from './member.entity';

export interface IMemberRepository {
    findAll(): Promise<Member[]>;
    findById(id: string): Promise<Member>;
    create(member: Member): Promise<Member>;
    update(id: string, member: Partial<Member>): Promise<Member>;
    delete(id: string): Promise<void>;
}