import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProductEntity } from '../entities/products.entity';
import { ProductDTO } from '../dto/product.dto';

@Injectable()
export default class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  /**
   * Create new product
   * @returns
   */
  create = async (product: ProductDTO): Promise<ProductEntity> => {
    const newProduct = this.productRepository.create({
      ...product,
      updatedBy: product.createdBy,
    });
    return await this.productRepository.save(newProduct);
  };

  /**
   * Get all
   * @returns
   */
  getAll = async (
    pagination: Paginations,
  ): Promise<ReturnData<ProductEntity>> => {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;
    const [content, count] = await Promise.all([
      this.productRepository.find({
        order: {
          name: 'ASC',
        },
        take: pageSize,
        skip,
      }),
      this.productRepository.count(),
    ]);

    const pages = page ? Math.ceil(count / pageSize) : undefined;
    return { content, count, pages };
  };

  /**
   *Get one product
   * @param id
   * @returns
   */
  getOne = async (id: number): Promise<ProductEntity | null> => {
    return await this.productRepository.findOne({ where: { id } });
  };

  /**
   * Update product
   * @param id
   * @param data
   * @returns
   */
  update = async (
    id: number,
    data: ProductDTO,
  ): Promise<ProductEntity | null> => {
    const product = (await this.productRepository.findOneBy({
      id,
    })) as ProductEntity;
    this.productRepository.merge(product, data);
    return await this.productRepository.save(product);
  };

  /**
   * Delete a product
   * @param id
   * @returns
   */
  delete = async (id: number): Promise<DeleteResult | null> => {
    const result = await this.productRepository.delete(id);
    return result.affected ? result : null;
  };
}
