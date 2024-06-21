import ProductService from '../services/product.service';
import {
  Controller,
  Body,
  Post,
  Get,
  Request,
  UseGuards,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductDTO } from '../dto/product.dto';
import { ProductEntity } from '../entities/products.entity';
import { AuthGuard } from 'src/users/authorisation/auth.guards';
import { PaginationDTO, ParamsDTO } from 'src/common.dto';
import { NotFoundError } from 'rxjs';
import { DeleteResult } from 'typeorm';

@Controller('products')
@ApiTags('Products')
export default class ProductController {
  constructor(private readonly product: ProductService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register new product' })
  @ApiResponse({ status: 201, description: 'Product registered successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Request() req,
    @Body() body: ProductDTO,
  ): Promise<ResponseData<ProductEntity>> {
    const { name, avatars, quantity, picture, price, categories } = body;
    const createdBy = req.user.id;

    const data = await this.product.create({
      name,
      avatars,
      quantity,
      picture,
      createdBy,
      price,
      categories,
    });

    return {
      error: false,
      message: 'Product created successfully',
      data,
    };
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getAll(
    @Query() query: PaginationDTO,
  ): Promise<ResponseData<ReturnData<ProductEntity>>> {
    const page = query.page!;
    const pageSize = query.pageSize!;

    const { content, pages, count } = await this.product.getAll({
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 12,
    });

    return {
      error: false,
      message: 'Success',
      data: { content, pages, count },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one products by Id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getOne(
    @Param() params: ParamsDTO,
  ): Promise<NotFoundError | ResponseData<ProductEntity>> {
    const { id } = params;
    const data = await this.product.getOne(id);
    return data
      ? {
          error: false,
          message: 'Success',
          data,
        }
      : new HttpException(
          {
            error: true,
            message: 'No product found',
          },
          HttpStatus.NOT_FOUND,
        );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update one products by Id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async updateOne(
    @Request() req,
    @Param() params: ParamsDTO,
    @Body() body: ProductDTO,
  ): Promise<NotFoundError | ResponseData<ProductEntity>> {
    const { id } = params;
    const { name, avatars, quantity, picture, price, categories } = body;
    const updatedBy = req.user.id;
    const data = await this.product.update(id, {
      name,
      avatars,
      quantity,
      picture,
      updatedBy,
      price,
      categories,
    } as ProductDTO);
    return data
      ? {
          error: false,
          message: 'Successfully updated the product',
          data,
        }
      : new HttpException(
          {
            error: true,
            message: 'No product found',
          },
          HttpStatus.NOT_FOUND,
        );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete one products by Id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async delete(
    @Param() params: ParamsDTO,
  ): Promise<NotFoundError | ResponseData<DeleteResult>> {
    const { id } = params;
    const data = await this.product.delete(id);
    return data
      ? {
          error: false,
          message: 'Success',
          data,
        }
      : new HttpException(
          {
            error: true,
            message: 'No product found',
          },
          HttpStatus.NOT_FOUND,
        );
  }
}
