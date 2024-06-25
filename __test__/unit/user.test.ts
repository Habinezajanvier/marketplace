import { Test, TestingModule } from '@nestjs/testing';
import { LoginDTO, UserDTO } from '../../src/users/dto/user.dto';
import UsersController from '../../src/users/controllers/user.controller';
import UsersService from '../../src/users/services/user.services';
import MessageService from '../../src/users/services/messages';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '../../src/users/helpers';

const createUserDto: UserDTO = {
  firstName: 'firstName #1',
  lastName: 'lastName #1',
  email: 'email@email.com',
  password: 'password',
  verified: true,
  phoneNumber: '0780000000',
};

const loginDTO: LoginDTO = {
  email: 'email@email.com',
  password: 'password',
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [
        ConfigModule.forFeature(async () => ({
          JWT_SECRET: 'test-secret',
        })),
      ],
      providers: [
        ConfigService,
        UsersService,
        JwtService,
        MessageService,
        {
          provide: UsersService,
          useValue: {
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
          },
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('register()', () => {
    it('should create a user', () => {
      usersController.register(createUserDto);
      console.log({ env: process.env.JWT_SECRET });
      expect(usersController.register(createUserDto)).resolves.toEqual({
        error: false,
        message: 'Account created successfuly',
      });
    });
  });

  describe('Login()', () => {
    it('Should login when data are provided ', () => {
      usersController.login(loginDTO);
      expect(usersService.checkUser).toHaveBeenCalled();
    });
  });

  //   describe('findOne()', () => {
  //     it('should find a user', () => {
  //       expect(usersController.findOne(1)).resolves.toEqual({
  //         firstName: 'firstName #1',
  //         lastName: 'lastName #1',
  //         id: 1,
  //       });
  //       expect(usersService.findOne).toHaveBeenCalled();
  //     });
  //   });

  //   describe('remove()', () => {
  //     it('should remove the user', () => {
  //       usersController.remove('2');
  //       expect(usersService.remove).toHaveBeenCalled();
  //     });
  //   });
});
