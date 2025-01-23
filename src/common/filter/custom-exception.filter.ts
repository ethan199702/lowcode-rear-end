import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class CustomExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();
    const statusCode = exception.getStatus();
    const exceptionResponse: any = exception.message;

    let message = "";
    if (exceptionResponse && Array.isArray(exceptionResponse))
      message = exceptionResponse.join(",");
    else message = exceptionResponse ?? "fail";

    response
      .json({
        statusCode,
        message,
        success: false
      })
      .end();
  }
}
