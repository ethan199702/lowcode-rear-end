import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({
    message: "用户名不能为空"
  })
  user_name: string;
  @IsNotEmpty({
    message: "密码不能为空"
  })
  password: string;
  @IsNotEmpty({
    message: "姓名不能为空"
  })
  real_name: string;
  @IsNotEmpty({
    message: "邮箱不能为空"
  })
  email: string;
  @IsNotEmpty({
    message: "手机号码不能为空"
  })
  phone_number: string;
  head_pic?: string;
}
