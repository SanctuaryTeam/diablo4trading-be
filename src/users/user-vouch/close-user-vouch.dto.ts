import { IsBoolean, IsInt, IsString, Max, Min } from 'class-validator';

export class CloseUserVouchDto {
    @IsString()
    id: string;

    @IsInt()
    @Min(0)
    @Max(10)
    rating: number;

    @IsBoolean()
    isPositive: boolean;

    @IsString()
    description: string;
}
