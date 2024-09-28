import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
    @ApiProperty({ example: 'M001', description: 'Code of the member' })
    code: string;

    @ApiProperty({ example: 'John Doe', description: 'Name of the member' })
    name: string;
}

export class UpdateMemberDto {
    @ApiProperty({ example: 'M001', description: 'Code of the member', required: false })
    code?: string;

    @ApiProperty({ example: 'John Doe', description: 'Name of the member', required: false })
    name?: string;
}

export class MemberResponseDto {
    @ApiProperty({ example: '1', description: 'ID of the member' })
    id: string;

    @ApiProperty({ example: 'M001', description: 'Code of the member' })
    code: string;

    @ApiProperty({ example: 'John Doe', description: 'Name of the member' })
    name: string;

    @ApiProperty({ example: false, description: 'Whether the member is penalized' })
    isPenalized: boolean;

    @ApiProperty({ example: null, description: 'End date of the penalty', required: false })
    penaltyEndDate?: Date;
}

export class CheckMemberResponseDto {
    @ApiProperty({ example: '1', description: 'ID of the member' })
    id: string;

    @ApiProperty({ example: 'John Doe', description: 'Name of the member' })
    name: string;

    @ApiProperty({ example: 2, description: 'Number of books borrowed by the member' })
    borrowedBooks: number;
}