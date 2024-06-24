import { ApiProperty } from '@nestjs/swagger';
import { CategoryDTO } from './category.dto';

class CategoryType {
  @ApiProperty()
  id: string;
}

export class ProductDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  picture?: string;

  @ApiProperty()
  avatars?: string[];

  @ApiProperty()
  price: number;

  @ApiProperty({ type: [CategoryType] })
  categories: CategoryDTO[];

  createdBy?: number;

  updatedBy?: number;

  id?: number;
}

export class AssignCategoryDTO {
  @ApiProperty({ type: [CategoryType] })
  categories: CategoryDTO[];
}
