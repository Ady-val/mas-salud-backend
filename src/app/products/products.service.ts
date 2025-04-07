import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CustomHttpException } from 'common/formats/http-exception.formats';
import { HTTP_STATUS } from 'common/constants/http-status.constants';
import { HTTP_MESSAGES } from 'common/constants/http-messages.constants';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseProductsDto } from './dto/products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../common/entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private async findOneById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw CustomHttpException(
        {
          field: 'id',
          error: HTTP_MESSAGES.PRODUCTS_ERROR.NOT_FOUND,
        },
        HTTP_STATUS.CLIENT_ERROR.NOT_FOUND,
      );
    }
    return plainToInstance(Product, product);
  }

  private async productExists(product: CreateProductDto): Promise<boolean> {
    const existingProduct = await this.productRepository.findOne({
      where: {
        name: product.name,
        brand: product.brand,
        dosage: product.dosage,
        unit: product.unit,
        lotNumber: product.lotNumber,
      },
    });
    if (existingProduct) {
      throw CustomHttpException(
        {
          field: 'lot_number',
          error: HTTP_MESSAGES.PRODUCTS_ERROR.ALREADY_EXISTS,
        },
        HTTP_STATUS.CLIENT_ERROR.CONFLICT,
      );
    }
    return false;
  }

  async create(product: CreateProductDto): Promise<Product> {
    await this.productExists(product);
    const newProduct = this.productRepository.create(product);
    const saved = await this.productRepository.save(newProduct);
    return plainToInstance(Product, saved);
  }

  async findOne(id: string): Promise<Product> {
    return this.findOneById(id);
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: Partial<{
      name: string;
      brand: string;
      form: string;
      unit: string;
      lot_number: string;
    }>,
  ): Promise<ResponseProductsDto> {
    const query = this.productRepository.createQueryBuilder('product');

    if (filters?.name) {
      query.andWhere('product.name LIKE :name', { name: `${filters.name}%` });
    }
    if (filters?.brand) {
      query.andWhere('product.brand LIKE :brand', { brand: `${filters.brand}%` });
    }
    if (filters?.form) {
      query.andWhere('product.form = :form', { form: filters.form });
    }
    if (filters?.unit) {
      query.andWhere('product.unit = :unit', { unit: filters.unit });
    }
    if (filters?.lot_number) {
      query.andWhere('product.lot_number LIKE :lot_number', {
        lot_number: `${filters.lot_number}%`,
      });
    }

    const count = await query.getCount();
    const totalPages = Math.ceil(count / limit);

    const data = await query
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return plainToInstance(ResponseProductsDto, {
      count,
      page,
      totalPages,
      limit,
      data,
    });
  }

  async update(id: string, product: Partial<UpdateProductDto>): Promise<Product> {
    const existingProduct = await this.findOneById(id);

    if (!existingProduct) {
      throw CustomHttpException(
        {
          field: 'id',
          error: HTTP_MESSAGES.PRODUCTS_ERROR.NOT_FOUND,
        },
        HTTP_STATUS.CLIENT_ERROR.NOT_FOUND,
      );
    }

    if (product.lotNumber && product.lotNumber !== existingProduct.lotNumber) {
      const lotExists = await this.productRepository.findOne({
        where: { lotNumber: product.lotNumber },
      });

      if (lotExists) {
        throw CustomHttpException(
          {
            field: 'lot_number',
            error: HTTP_MESSAGES.PRODUCTS_ERROR.ALREADY_EXISTS,
          },
          HTTP_STATUS.CLIENT_ERROR.CONFLICT,
        );
      }
    }

    const updated = { ...existingProduct, ...product };
    await this.productRepository.save(updated);
    return plainToInstance(Product, updated);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOneById(id);
    await this.productRepository.softRemove(product);
  }
}
