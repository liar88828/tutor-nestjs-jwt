import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategies";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "./common/guards";

@Module({
  imports: [
    // PrismaModule,
    JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ]
})
export class AuthModule {
}
