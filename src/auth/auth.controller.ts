import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from "./types";
import { AtGuard, RtGuard } from "./common/guards";
import { GetCurrentUser, GetCurrentUserId } from "./common/decorator";

@Controller("auth")
export class AuthController {


  constructor(private authService: AuthService) {
  }

  @Post("/local/signup")
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signUpLocal(dto);
  }

  @Post("/local/signin")
  @HttpCode(HttpStatus.OK)
  async signInLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signInLocal(dto);
  }

  @UseGuards(AtGuard)
  @Post("/logout")
  @HttpCode(HttpStatus.OK)
  async logoutLocal(@GetCurrentUserId() id: number) {
    // const user = req.user as JwtPayload;
    // console.log(user);
    return this.authService.logoutLocal(id);

  }

  @UseGuards(RtGuard)
  @Post("/refresh")
  @HttpCode(HttpStatus.OK)
  async refreshLocal(
    @GetCurrentUserId() id: number,
    @GetCurrentUser("refreshToken") refreshToken: string
  ) {
    // const user = req.user as JwtPayload;
    console.log(id, refreshToken);
    return this.authService.refreshLocal(id, refreshToken);
  }

}
