import * as jwt from 'jsonwebtoken';
//  { SignOptions, JwtPayload }

/**
 * encodeToken
 * @param payload
 * @returns
 */
export const encode = (
  payload: jwt.JwtPayload,
  expiresIn: string | number = '1d',
) => {
  const options: jwt.SignOptions = {
    expiresIn: expiresIn,
    algorithm: 'HS256',
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, options);
  return token;
};

/**
 * decodeToken
 * @param token
 * @returns
 */
export const decode = (token: string): jwt.JwtPayload => {
  const payload = jwt.verify(token, process.env.JWT_SECRET as string);
  return payload as jwt.SignOptions;
};
