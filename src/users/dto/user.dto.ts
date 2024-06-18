import { ApiProperty } from '@nestjs/swagger';

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
