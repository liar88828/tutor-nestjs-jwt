import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from "./types";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { JwtPayload } from "./strategies";

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

  @UseGuards(AuthGuard("jwt"))
  @Post("/logout")
  @HttpCode(HttpStatus.OK)
  async logoutLocal(@Req() req: Request) {
    const user = req.user as JwtPayload;
    // console.log(user);
    return this.authService.logoutLocal(user["sub"]);

  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("/refresh")
  @HttpCode(HttpStatus.OK)
  async refreshLocal(@Req() req: Request) {
    const user = req.user as JwtPayload;
    // console.log(user);
    return this.authService.refreshLocal(
      user["sub"],
      user["refreshToken"]);
  }

}
