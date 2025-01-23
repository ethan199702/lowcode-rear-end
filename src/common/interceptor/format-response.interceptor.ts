import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";
import { omit } from "lodash";
import { EXCULDE_FIELDS_KEY } from "../decorator/exclude-fields.decorator";

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  /** 获取mateData元数据 的方法 */
  @Inject(Reflector)
  private readonly reflector: Reflector;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    const exculdeFields = this.reflector?.get<string[]>(
      EXCULDE_FIELDS_KEY,
      context.getHandler()
    );

    return next
      .handle()
      .pipe(
        map(data =>
          this.formatResponse(
            response.statusCode as number,
            data,
            exculdeFields
          )
        )
      );
  }

  private exculdeFormatData(data: any, exculdeFields: string[] = []) {
    if (Array.isArray(data))
      return data.map(v => ({ ...omit(v, exculdeFields) }));

    return { ...omit(data, exculdeFields) };
  }

  private formatResponse(
    statusCode: number,
    data: any,
    exculdeFields?: string[]
  ) {
    let result: any;
    if (exculdeFields && exculdeFields.length > 0)
      result = this.exculdeFormatData(data, exculdeFields);
    else result = data;
    return {
      statusCode,
      message: "success",
      result,
      success: true
    };
  }
}
