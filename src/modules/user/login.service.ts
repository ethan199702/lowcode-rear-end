import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService, RedisService } from "src/common/index.service";

import { LoginUserDto } from "./dto";

import { md5 } from "../../utils/md5";

@Injectable()
export class LoginService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(RedisService)
  private readonly redis: RedisService;

  @Inject(JwtService)
  private readonly jwt: JwtService;

  @Inject(ConfigService)
  private readonly config: ConfigService;

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        user_name: loginUserDto.user_name
      }
    });

    if (!user) throw new HttpException("用户不存在", HttpStatus.BAD_REQUEST);
    const random = await this.redis.get(loginUserDto.checkKey);
    if (random !== loginUserDto.captcha)
      throw new HttpException("验证码不存在或已失效", HttpStatus.BAD_REQUEST);

    if (md5(loginUserDto.password) !== user.password)
      throw new HttpException("密码错误", HttpStatus.BAD_REQUEST);
    await this.redis.del(loginUserDto.checkKey);

    const access_token = this.jwt.sign(
      {
        id: user.id,
        username: user.user_name
      },
      {
        expiresIn: this.config.get("JWT_ACCESS_TOKEN_EXPIRES")
      }
    );

    const refresh_token = this.jwt.sign(
      {
        id: user.id,
        username: user.user_name
      },
      { expiresIn: this.config.get("JWT_REFRESH_TOKEN_EXPIRES") }
    );

    return { ...user, access_token, refresh_token };
  }
}
