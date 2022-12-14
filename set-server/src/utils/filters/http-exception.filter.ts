import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : "Internal server error";

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    response.status(status).json({
      status: status,
      timestamp: Date.now(),
      error: {
        message: message,
        path: request.url,
      },
    });
  }
}
