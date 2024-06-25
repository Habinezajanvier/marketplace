import { UserDTO } from '../../src/users/dto/user.dto';

export default {
  create: jest
    .fn()
    .mockImplementation((user: UserDTO) =>
      Promise.resolve({ id: '1', ...user }),
    ),
  findAll: jest.fn().mockResolvedValue([
    {
      firstName: 'firstName #1',
      lastName: 'lastName #1',
      id: 1,
    },
    {
      firstName: 'firstName #2',
      lastName: 'lastName #2',
      id: 1,
    },
  ]),
  findOne: jest.fn().mockImplementation((id: string) =>
    Promise.resolve({
      firstName: 'firstName #1',
      lastName: 'lastName #1',
      id,
    }),
  ),
  update: jest.fn().mockImplementation((id: string) =>
    Promise.resolve({
      firstName: 'firstName #1',
      lastName: 'lastName #1',
      id,
    }),
  ),
  checkUser: jest
    .fn()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .mockImplementation((_email: string) => Promise.resolve(null)),
  remove: jest.fn(),
};
