import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {

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
