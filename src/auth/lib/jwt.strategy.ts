import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import e from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SEC,
      passReqToCallback: true,
    });
  }

  async validate(req: e.Request, payload: any, done: VerifiedCallback) {
    if (req.url.includes('admin')) {
      if (payload.roles == 'admin') {
        return { id: payload.id, username: payload.username };
      } else {
        return done(
          new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED),
          false,
        );
      }
    } else {
      return { username: payload.username, id: payload.id };
    }  
  }
}
