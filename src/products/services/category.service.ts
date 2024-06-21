import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryDTO } from '../dto/category.dto';

@Injectable()
export default class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  /**
   * Create new category
   * @returns
   */
  create = async (category: CategoryDTO): Promise<CategoryEntity> => {
    const newCat = this.categoryRepository.create({
      ...category,
      updatedBy: category.createdBy,
    });
    return await this.categoryRepository.save(newCat);
  };

  /**
   * Get all
   * @returns
   */
  getAll = async (): Promise<CategoryEntity[]> => {
    return await this.categoryRepository.find({
      order: {
        name: 'ASC',
      },
    });
  };

  /**
   *Get one category
   * @param id
   * @returns
   */
  getOne = async (id: number): Promise<CategoryEntity | null> => {
    return await this.categoryRepository.findOne({ where: { id } });
  };

  /**
   * Update category
   * @param id
   * @param data
   * @returns
   */
  update = async (
    id: number,
    data: CategoryDTO,
  ): Promise<CategoryEntity | null> => {
    const category = (await this.categoryRepository.findOneBy({
      id,
    })) as CategoryEntity;
    this.categoryRepository.merge(category, data);
    return await this.categoryRepository.save(category);
  };

  /**
   * Delete a category
   * @param id
   * @returns
   */
  delete = async (id: number): Promise<DeleteResult | null> => {
    const result = await this.categoryRepository.delete(id);
    return result.affected ? result : null;
  };
}
