import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Tokens } from "./types";

@Controller("auth")
export class AuthController {


  constructor(private authService: AuthService) {
  }

  @Post("/local/signup")
  async signUpLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signUpLocal(dto);
  }

  @Post("/local/signin")
  async signInLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signInLocal(dto);
  }

  @Post("/logout")
  async logoutLocal() {
    return this.authService.logoutLocal();

  }

  @Post("/refresh")
  async refreshLocal() {
    return this.authService.refreshLocal();
  }

}
