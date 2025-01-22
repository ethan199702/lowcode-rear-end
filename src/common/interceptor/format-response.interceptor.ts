import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";
import { EXCULDE_FIELDS_KEY } from "../decorator/exclude-fields.decorator";

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  /** 获取mateData元数据 的方法 */
  @Inject(Reflector)
  private readonly reflector: Reflector;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    const exculdeFields = this.reflector.get<string[]>(
      EXCULDE_FIELDS_KEY,
      context.getHandler()
    );

    console.log(exculdeFields);

    return next
      .handle()
      .pipe(
        map(data => this.formatResponse(response.statusCode as number, data))
      );
  }

  private formatResponse(statusCode: number, data: any) {
    return {
      statusCode,
      message: "success",
      result: data,
      success: true
    };
  }
}
