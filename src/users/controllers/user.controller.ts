import UserService from '../services/user.services';
import { JwtService, comparePassword, hashPassword } from '../helpers';
import { LoginDTO, UserDTO, VerifyDTO } from '../dto/user.dto';
// import { UserEntity } from '../user.entity';

import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
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
import { AuthGuard } from '../../guards/auth.guards';
import MessageService, { MessageChannels } from '../services/messages';
import { MailerService } from '../services/message.gateway';
import { otpTemplate } from '../../template/otpTemplate';
import digitid from '../helpers/digitid';
import { RolesGuard } from 'src/guards/role.guards';
import { Roles } from 'src/decorators/role.decorators';
import { Role } from '../constant';
import { UserEntity } from '../user.entity';
import { PaginationDTO } from 'src/common.dto';

/**
 * User controller
 */
@Controller('users')
@ApiTags('users')
export default class UserController {
  constructor(
    private readonly user: UserService,
    private message: MessageService,
    private jwtService: JwtService,
  ) {
    this.message.registerChannel(
      MessageChannels.NODE_MAILER,
      new MailerService(),
    );
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @HttpCode(201)
  async register(
    @Body() body: UserDTO,
  ): Promise<ConflictException | ResponseData<null>> {
    const { firstName, lastName, email, password, phoneNumber, role } = body;

    const userExist = await this.user.checkUser(email);
    if (userExist) {
      return new ConflictException({
        error: true,
        message: 'Email exist, try login',
      });
    }
    const hashedPassword = await hashPassword(password);

    const data: UserDTO = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    };

    const newUser = await this.user.create(data);

    const otp = digitid(5);
    const hashedOtp = await hashPassword(otp);
    const otpToken = this.jwtService.encode({ otp: hashedOtp }, 600);

    const emailTemplate = otpTemplate(otp, newUser.firstName);

    await this.message.sendMessage(
      { email: newUser.email!, title: 'Password Reset', text: emailTemplate },
      MessageChannels.NODE_MAILER,
    );

    await this.user.update(newUser.id, { otp: otpToken } as UserDTO);

    return {
      error: false,
      message: 'Account created successfuly',
    };
  }

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged successfully' })
  @HttpCode(200)
  async login(
    @Body() body: LoginDTO,
  ): Promise<
    ForbiddenException | ResponseData<Record<'access_token', string>>
  > {
    const { email, password } = body;
    const userExist = await this.user.checkUser(email);

    if (!userExist) {
      throw new ForbiddenException("Email or password doesn't exist", {
        cause: new Error(),
        description: 'Authentication error',
      });
    }

    if (!userExist.verified) {
      throw new ForbiddenException('Account is not verified', {
        cause: new Error(),
        description: 'Verification error',
      });
    }

    const validPass = await comparePassword(password, userExist.password);

    if (!validPass) {
      return new ForbiddenException("Email or password doesn't exist", {
        cause: new Error(),
        description: 'Authentication error',
      });
    }
    const token = this.jwtService.encode({
      email,
      id: userExist.id,
      role: userExist.role,
    });
    return {
      error: false,
      message: 'User logged successfully',
      data: {
        access_token: token,
      },
    };
  }

  @Post('/verify')
  @ApiOperation({ summary: 'User verification' })
  @ApiResponse({ status: 200, description: 'User Verified successfully' })
  @HttpCode(200)
  async verify(@Body() body: VerifyDTO) {
    const { otp, email } = body;
    const userExist = await this.user.checkUser(email);

    if (!userExist) {
      return new ForbiddenException("Email or password doesn't exist", {
        cause: new Error(),
        description: 'Authentication error',
      });
    }

    const otpHash = this.jwtService.decode(userExist.otp);
    if (!otpHash) {
      return new ForbiddenException('Failed to load your OTP', {
        cause: new Error(),
        description: 'OTP error',
      });
    }

    const verify = await comparePassword(otp, otpHash.otp);
    if (!verify) {
      return new ForbiddenException('Failed to verify your OTP', {
        cause: new Error(),
        description: 'OTP error',
      });
    }
    await this.user.update(userExist.id, { verified: true } as UserDTO);
    const token = this.jwtService.encode({
      email,
      id: userExist.id,
      role: userExist.role,
    });

    return {
      error: false,
      message: 'User Verified successfully',
      data: {
        access_token: token,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/profile')
  @ApiOperation({ summary: 'User profile' })
  @ApiResponse({ status: 200, description: 'Get user profile' })
  async profile(@Request() req) {
    const data = await this.user.getOne(+req.user.id);
    return {
      error: false,
      message: 'Success',
      data,
    };
  }

  @Get('/')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getAll(
    @Query() query: PaginationDTO,
  ): Promise<ResponseData<ReturnData<UserEntity>>> {
    const page = query.page!;
    const pageSize = query.pageSize!;

    const { content, pages, count } = await this.user.getAll({
      page: page ? +page : 1,
      pageSize: pageSize ? +pageSize : 12,
    });

    return {
      error: false,
      message: 'Success',
      data: { content, pages, count },
    };
  }
}
