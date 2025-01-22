import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @IsNotEmpty({
    message: "用户名不能为空"
  })
  user_name: string;

  @IsNotEmpty({
    message: "密码不能为空"
  })
  password: string;

  @IsNotEmpty({
    message: "验证码不能为空"
  })
  captcha: string;

  @IsNotEmpty({
    message: "checkKey不能为空"
  })
  checkKey: string;
}
