import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";

import { CreateUserDto, UpdateUserDto, LoginUserDto } from "./dto";
import { PrismaService, RedisService } from "src/common/index.service";

import { md5, generateRandomCode } from "../../utils/md5";
import { LoginService } from "./login.service";

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(RedisService)
  private readonly redis: RedisService;

  @Inject(LoginService)
  private readonly loginService: LoginService;

  async register(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
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
    return await this.loginService.login(loginUserDto);
  }

  async random(k: string) {
    const randomCode = generateRandomCode();
    await this.redis.set(k, randomCode, 300);
    return randomCode;
  }

  async findAll() {
    const list = await this.prisma.user.findMany();
    return list;
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
