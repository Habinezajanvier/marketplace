import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { OrderEntity } from '../entities/orders.entitiy';
import { OrderDTO } from '../dto/orders.dto';
import { PaginationDTO } from 'src/common.dto';
import { OrderItemsEntity } from '../entities/productOrder.entity';
import { RabbitMQConnection } from 'src/rabbit.connection';

@Injectable()
export default class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    private readonly dataSource: DataSource,
    private readonly mqConnection: RabbitMQConnection,
  ) {}

  /**
   * Create new user
   * @returns
   */
  create = async (order: OrderDTO): Promise<OrderEntity | null> => {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let orderData: OrderEntity;
    try {
      await this.mqConnection.sendToQueue('orders', order.products);
      orderData = await queryRunner.manager.save(OrderEntity, {
        createdBy: order.createdBy,
        updatedBy: order.createdBy,
        location: order.location,
        status: order.status,
      });

      await Promise.all(
        order.products.map((item) => {
          queryRunner.manager.save(OrderItemsEntity, {
            order: orderData,
            productId: item.id,
            quantity: item.quantity,
            amount: item.price * item.quantity,
          });
        }),
      );
      await queryRunner.commitTransaction();
      return orderData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  };

  /**
   * Get all
   * @returns
   */
  getAll = async (
    pagination: PaginationDTO,
  ): Promise<ReturnData<OrderEntity>> => {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;
    const content = await this.orderRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: pageSize,
      skip,
      relations: {
        orderItems: true,
      },
      select: {
        id: true,
        createdBy: true,
        createdAt: true,
        location: {
          district: true,
          sector: true,
          village: true,
        },
        orderItems: {
          id: true,
          amount: true,
          quantity: true,
          createdAt: true,
        },
      },
    });
    const count = await this.orderRepository.count();
    const pages = page ? Math.ceil(count / pageSize) : undefined;
    return { content, count, pages };
  };

  /**
   *Get one user
   * @param id
   * @returns
   */
  getOne = async (id: number): Promise<OrderEntity | null> => {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        orderItems: true,
      },
      select: {
        id: true,
        location: {
          district: true,
          sector: true,
          village: true,
        },
        createdBy: true,
        orderItems: {
          id: true,
          amount: true,
          quantity: true,
          createdAt: true,
        },
      },
    });
  };

  /**
   *Get owners orders
   * @param id
   * @returns
   */
  getOwner = async (userId: number): Promise<OrderEntity[]> => {
    return await this.orderRepository.find({
      where: { createdBy: userId },
      relations: {
        orderItems: true,
      },
      select: {
        id: true,
        location: {
          district: true,
          sector: true,
          village: true,
        },
        createdBy: true,
        orderItems: {
          id: true,
          amount: true,
          quantity: true,
          createdAt: true,
        },
      },
    });
  };

  /**
   * Update user
   * @param id
   * @param data
   * @returns
   */
  update = async (id: number, data: OrderDTO): Promise<OrderEntity | null> => {
    const user = (await this.orderRepository.findOneBy({ id })) as OrderEntity;
    this.orderRepository.merge(user, data);
    return await this.orderRepository.save(user);
  };

  /**
   * Delete a user
   * @param id
   * @returns
   */
  delete = async (id: number): Promise<DeleteResult | null> => {
    const result = await this.orderRepository.delete(id);
    return result.affected ? result : null;
  };
}
