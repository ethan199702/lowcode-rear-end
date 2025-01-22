import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { LoginService } from "./login.service";

@Module({
  controllers: [UserController],
  providers: [UserService, LoginService]
})
export class UserModule {}
