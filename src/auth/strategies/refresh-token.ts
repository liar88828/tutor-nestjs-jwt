import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "rt-secret",
      passReqToCallback: true
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req
      .get("authorization")
      .replace("Bearer", "")
      .trim();
    return {
      ...payload,
      refreshToken
    };


  }
}
