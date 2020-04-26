import * as jwt from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../db/relational/repositories/user';
import { User } from '../db/relational/entities/User';
import { UnauthorizedError, ActivationError } from '../errors';

export interface AuthUser {
  id: number;
  username: string;
  role: Role;
}

export enum Role {
  user = 'user',
  admin = 'admin'
}

export interface Authenticator {
  validate(token: string): Promise<AuthUser>;
  authenticate(user: User): string;
}

export class JWTAuthenticator implements Authenticator {
  private secret: string;

  constructor() {
    this.secret = process.env.SECRET_KEY || 'secret';
  }

  public async validate(token: string): Promise<AuthUser> {
    try {
      const decode: any = jwt.verify(token, this.secret);
      const user: User = await getCustomRepository(UserRepository).findByUsername(decode.username);
      if (!user.activated) {
        throw new ActivationError();
      }
      return {
        id: user.id,
        username: user.username,
        role: user.role as Role
      };
    } catch (err) {
      throw new UnauthorizedError(err);
    }
  }

  public authenticate(user: User): string {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role, activated: user.activated },
      this.secret,
      {
        expiresIn: 60 * 60
      }
    );
  }
}
