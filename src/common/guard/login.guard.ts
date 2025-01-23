import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from "express";
import { IS_PUBLIC } from "../decorator/public.decorator";

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;

  @Inject(JwtService)
  private readonly jwtService: JwtService;
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) return true;
    const token = request.headers.authorization;
    if (!token) throw new HttpException("用户未登录", HttpStatus.UNAUTHORIZED);

    try {
      this.jwtService.verify(token);
      return true;
    } catch (e) {
      throw new HttpException(
        "token已过期,请重新登录",
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
