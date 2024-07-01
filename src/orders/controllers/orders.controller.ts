import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderDTO, OrderStatus } from '../dto/orders.dto';
import { AuthGuard } from 'src/guards/auth.guards';
import OrderService from '../services/order.service';
import { PaginationDTO, ParamsDTO } from 'src/common.dto';
import { OrderEntity } from '../entities/orders.entitiy';
import { NotFoundError } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { Roles } from 'src/decorators/role.decorators';
import { Role } from 'src/users/constant';
import { RolesGuard } from 'src/guards/role.guards';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private readonly order: OrderService) {}

  @Post('/place_order')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Place order' })
  @ApiResponse({ status: 201, description: 'Order placed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async placeOrder(@Request() req, @Body() body: OrderDTO) {
    const createdBy = req.user.id;
    const { products, location } = body;

    const data = await this.order.create({
      createdBy,
      status: OrderStatus.PENDING,
      location,
      products,
    });

    return data
      ? {
          error: false,
          message: 'Success',
          data,
        }
      : new HttpException(
          {
            error: true,
            message: 'Internal server error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async gelAll(
    @Query() query: PaginationDTO,
  ): Promise<ResponseData<ReturnData<OrderEntity>>> {
    const page = query.page!;
    const pageSize = query.pageSize!;

    const { content, pages, count } = await this.order.getAll({
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 12,
    });

    return {
      error: false,
      message: 'Success',
      data: { content, pages, count },
    };
  }

  @Get('/my_orders')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user's order" })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getOwnerOrder(
    @Request() req,
  ): Promise<NotFoundError | ResponseData<OrderEntity[]>> {
    const { id } = req.user;
    const data = await this.order.getOwner(id);
    return data.length
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

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one order by Id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getOne(
    @Param() params: ParamsDTO,
  ): Promise<NotFoundError | ResponseData<OrderEntity>> {
    const { id } = params;
    const data = await this.order.getOne(id);
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

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete one products by Id' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async delete(
    @Param() params: ParamsDTO,
  ): Promise<NotFoundError | ResponseData<DeleteResult>> {
    const { id } = params;
    const data = await this.order.delete(id);
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
