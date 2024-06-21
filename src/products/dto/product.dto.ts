import { ApiProperty } from '@nestjs/swagger';

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

  createdBy?: number;

  updatedBy?: number;
}
