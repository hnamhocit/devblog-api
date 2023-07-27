import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface HttpResponse<T> {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, HttpResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // format lại response theo dạng Response<T>, bao gồm cả success và message

        const success = data?.success ?? true;
        const message = data?.message ?? 'success';
        const statusCode =
          data?.statusCode ?? context.switchToHttp().getResponse().statusCode;

        return {
          statusCode,
          success,
          message,
          data: data.data,
        };
      }),
    );
  }
}
