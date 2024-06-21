import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO implements Paginations {
  @ApiProperty({ required: false })
  page?: number;
  @ApiProperty({ required: false })
  pageSize?: number;
}

export class ParamsDTO {
  @ApiProperty()
  id: number;
}
