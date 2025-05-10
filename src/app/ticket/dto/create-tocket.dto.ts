import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  @IsNotEmpty()
  beneficiaryId: string;

  @IsNotEmpty()
  inventoryItemId: string[];
}
