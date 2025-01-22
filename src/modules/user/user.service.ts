import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";

import { CreateUserDto, UpdateUserDto, LoginUserDto } from "./dto";
import { PrismaService, RedisService } from "src/common/index.service";

import { md5, generateRandomCode } from "../../utils/md5";

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(RedisService)
  private readonly redis: RedisService;

  async register(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        user_name: createUserDto.user_name
      }
    });

    if (user) throw new HttpException("用户名以存在", HttpStatus.BAD_REQUEST);

    return await this.prisma.user.create({
      data: { ...createUserDto, password: md5(createUserDto.password) }
    });
  }

  async logon(loginUserDto: LoginUserDto) {
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

    return user;
  }

  async random(k: string) {
    const randomCode = generateRandomCode();
    await this.redis.set(k, randomCode, 300);
    return randomCode;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);

    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
