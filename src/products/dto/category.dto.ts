import { ApiProperty } from '@nestjs/swagger';

export class CategoryDTO {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description: string;

  createdBy?: number;

  updatedBy?: number;
}
