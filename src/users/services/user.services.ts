import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserDTO } from '../dto/user.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Create new user
   * @returns
   */
  create = async (user: UserDTO): Promise<UserEntity> => {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  };

  /**
   * Get all
   * @returns
   */
  getAll = async (pagination: Paginations): Promise<ReturnData<UserEntity>> => {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;
    const [content, count] = await Promise.all([
      this.userRepository.find({
        order: {
          updatedAt: 'ASC',
        },
        take: pageSize,
        skip,
        select: [
          'id',
          'firstName',
          'lastName',
          'email',
          'phoneNumber',
          'status',
          'createdAt',
          'updatedAt',
          'role',
        ],
      }),
      this.userRepository.count(),
    ]);
    const pages = page ? Math.ceil(count / pageSize) : undefined;
    return { content, count, pages };
  };

  /**
   *Get one user
   * @param id
   * @returns
   */
  getOne = async (id: number): Promise<UserEntity | null> => {
    return await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'status',
        'createdAt',
        'updatedAt',
        'role',
      ],
    });
  };

  /**
   *
   * @param phoneNumber
   * @returns
   */
  checkUser = async (email: string): Promise<UserEntity | null> => {
    return await this.userRepository.findOne({
      where: { email },
    });
  };

  /**
   * Update user
   * @param id
   * @param data
   * @returns
   */
  update = async (id: number, data: UserDTO): Promise<UserEntity | null> => {
    const user = (await this.userRepository.findOneBy({ id })) as UserEntity;
    this.userRepository.merge(user, data);
    return await this.userRepository.save(user);
  };

  /**
   * Delete a user
   * @param id
   * @returns
   */
  delete = async (id: number): Promise<DeleteResult | null> => {
    const result = await this.userRepository.delete(id);
    return result.affected ? result : null;
  };
}
