import { Expose } from 'class-transformer';

export class GroupedInventory {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  quantity: number;

  @Expose()
  batches: number;

  @Expose()
  productId: string;

  @Expose()
  institutionId: string;

  @Expose()
  institution: string;
}
