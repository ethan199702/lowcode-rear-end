import { IsNotEmpty, Max, Min } from "class-validator";

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
  @Max(6, {
    message: "验证码不能大于6位"
  })
  @Min(6, {
    message: "验证码不能小于6位"
  })
  captcha: string;
  @IsNotEmpty({
    message: "checkKey不能为空"
  })
  checkKey: string;
}
