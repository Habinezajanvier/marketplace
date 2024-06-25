import { Test, TestingModule } from '@nestjs/testing';
import { LoginDTO, UserDTO } from '../../src/users/dto/user.dto';
import UsersController from '../../src/users/controllers/user.controller';
import UsersService from '../../src/users/services/user.services';
import MessageService from '../../src/users/services/messages';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '../../src/users/helpers';
import userService from '../mocks/userService';
import messageServiceMock from '../mocks/messageService.mock';

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
          useValue: userService,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
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
      const userReg = usersController.register(createUserDto);
      expect(userReg).resolves.toEqual({
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
});
