import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";


export type JwtPayload = {
  sub: number,
  email: string,
  refreshToken?: string
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: "at-secret"
    });
  }

  validate(payload: any) {
    return payload;
  }
}
