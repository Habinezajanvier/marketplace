import CategoryService from '../services/category.service';
import {
  Controller,
  Body,
  Post,
  Get,
  Request,
  UseGuards,
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
import { CategoryDTO } from '../dto/category.dto';
import { CategoryEntity } from '../entities/category.entity';
import { AuthGuard } from 'src/users/authorisation/auth.guards';
import { ParamsDTO } from 'src/common.dto';
import { NotFoundError } from 'rxjs';
import { DeleteResult } from 'typeorm';

@Controller('categories')
@ApiTags('Category')
export default class CategoryController {
  constructor(private readonly category: CategoryService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register new Category' })
  @ApiResponse({ status: 201, description: 'Category registered successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Request() req,
    @Body() body: CategoryDTO,
  ): Promise<ResponseData<CategoryEntity>> {
    const { name, description } = body;
    const createdBy = req.user.id;

    const data = await this.category.create({
      name,
      createdBy,
      description,
    });

    return {
      error: false,
      message: 'Category created successfully',
      data,
    };
  }

  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getAll(): Promise<ResponseData<CategoryEntity[]>> {
    const data = await this.category.getAll();

    return {
      error: false,
      message: 'Success',
      data,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one category by Id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getOne(
    @Param() params: ParamsDTO,
  ): Promise<NotFoundError | ResponseData<CategoryEntity>> {
    const { id } = params;
    const data = await this.category.getOne(id);
    return data
      ? {
          error: false,
          message: 'Success',
          data,
        }
      : new HttpException(
          {
            error: true,
            message: 'No category found',
          },
          HttpStatus.NOT_FOUND,
        );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update one category by Id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async updateOne(
    @Request() req,
    @Param() params: ParamsDTO,
    @Body() body: CategoryDTO,
  ): Promise<NotFoundError | ResponseData<CategoryEntity>> {
    const { id } = params;
    const { name, description } = body;
    const updatedBy = req.user.id;
    const data = await this.category.update(id, {
      name,
      updatedBy,
      description,
    });
    return data
      ? {
          error: false,
          message: 'Successfully updated the category',
          data,
        }
      : new HttpException(
          {
            error: true,
            message: 'No category found',
          },
          HttpStatus.NOT_FOUND,
        );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete one category by Id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async delete(
    @Param() params: ParamsDTO,
  ): Promise<NotFoundError | ResponseData<DeleteResult>> {
    const { id } = params;
    const data = await this.category.delete(id);
    return data
      ? {
          error: false,
          message: 'Success',
          data,
        }
      : new HttpException(
          {
            error: true,
            message: 'No category found',
          },
          HttpStatus.NOT_FOUND,
        );
  }
}
