import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private secret: string;
  constructor(private configService: ConfigService) {
    this.secret = this.configService.get<string>('JWT_SECRET');
  }
  /**
   * encodeToken
   * @param payload
   * @returns
   */
  encode = (payload: jwt.JwtPayload, expiresIn: string | number = '1d') => {
    const options: jwt.SignOptions = {
      expiresIn: expiresIn,
      algorithm: 'HS256',
    };
    const token = jwt.sign(payload, this.secret as string, options);
    return token;
  };

  /**
   * decodeToken
   * @param token
   * @returns
   */
  decode = (token: string): jwt.JwtPayload => {
    const payload = jwt.verify(token, this.secret as string);
    return payload as jwt.SignOptions;
  };
}
