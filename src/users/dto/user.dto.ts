import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../constant';

export class UserDTO {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  password?: string;

  otp?: string;

  verified?: boolean;

  @ApiProperty()
  role: Role;
}

export class LoginDTO {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class VerifyDTO {
  @ApiProperty()
  email: string;
  @ApiProperty()
  otp: string;
}
