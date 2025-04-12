import { IsInt, Min } from 'class-validator';

export class EntryDto {
  @IsInt()
  @Min(1)
  quantity: number;
}

export class ExitDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
