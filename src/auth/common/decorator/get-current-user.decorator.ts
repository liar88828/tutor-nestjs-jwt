import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../../strategies";

export const GetCurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest();
    // console.log(request.user);
    if (!data) return request.user;
    return request.user[data];
  }
);
