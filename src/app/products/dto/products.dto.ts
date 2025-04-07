import { Product } from '../../../common/entities/products.entity';
import { Expose, Type } from 'class-transformer';

export class ResponseProductsDto {
  @Expose()
  count: number;

  @Expose()
  page: number;

  @Expose()
  totalPages: number;

  @Expose()
  limit: number;

  @Expose()
  @Type(() => Product)
  data: Product[];
}
