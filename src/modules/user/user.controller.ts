import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto, LoginUserDto } from "./dto";

@Controller("user")
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Get("random/:time")
  random(@Param("time") time: string) {
    return this.userService.random(time);
  }

  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.logon(loginUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get("profile/:id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
