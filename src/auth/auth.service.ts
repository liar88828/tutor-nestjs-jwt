import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as bcrypt from "bcrypt";
import { Tokens } from "./types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
              private jwtService: JwtService) {
  }

  async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }


  async hasToken(id: number, email: string, exp: number, secret: string) {
    return this.jwtService.signAsync(
      { sub: id, email },
      { expiresIn: exp, secret: secret }
    );
  }

  async getToken(user_id: number, email: string): Promise<Tokens> {

    const [at, rt] = await Promise.all([
      this.hasToken(user_id, email, 60 * 15, "at-secret"),
      this.hasToken(user_id, email, 60 * 60 * 24 * 7, "rt-secret")
    ]);
    return {
      access_token: at,
      refresh_token: rt
    };
  }

  async updateRefreshToken(user_id: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    const updataRefresh = await this.prisma.user.update({
      where: {
        id: user_id
      },
      data: {
        refresh_token: hash
      }
    });
    console.log(updataRefresh);
  }

  async signUpLocal(dto: AuthDto): Promise<Tokens> {
    const hash_pass: string = await this.hashData(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash_pass
      }
    });
    const token = await this.getToken(user.id, user.email);
    await this.updateRefreshToken(user.id, token.refresh_token);
    return token;
  }


  async signInLocal(dto: AuthDto): Promise<Tokens> {

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    if (!user) throw new ForbiddenException("Invalid Email");

    const isValid = await bcrypt.compare(dto.password, user.hash_pass);
    if (!isValid) throw new ForbiddenException("Invalid Password");

    const token = await this.getToken(user.id, user.email);
    await this.updateRefreshToken(user.id, token.refresh_token);
    return token;

  }

  async logoutLocal(id: number) {
    // console.log(id);
    if (!id) throw new ForbiddenException("Not Authorized");

    const user = await this.prisma.user.update({
      where: {
        id
        // refresh_token: { not: null }
      },
      data: {
        refresh_token: null
      }
    });
    return "User : " + user.email + " Success Logout";
  }

  async refreshLocal(
    id: number,
    refresh_token: string) {
    if (!id) throw new ForbiddenException("Not Authorized");

    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user || !user.refresh_token) throw new ForbiddenException("user not found");

    // console.table({ refresh_token, data: user.refresh_token });
    const isValid = await bcrypt.compare(refresh_token, user.refresh_token);
    // console.log(user.refresh_token);
    // console.log(refresh_token);
    // console.log(isValid);
    if (!isValid) throw new ForbiddenException("Invalid Refresh Token");

    const token = await this.getToken(user.id, user.email);
    await this.updateRefreshToken(user.id, token.refresh_token);
    // console.log("success");
    return token;


  }
}
