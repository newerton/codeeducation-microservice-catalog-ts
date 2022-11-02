import { EntityValidationErrorFilter } from '@common/filters/entity-validation.filter';
import { NotFoundErrorFilter } from '@common/filters/not-found-error.filter';
import { PaginationInterceptor } from '@common/interceptors/pagination/pagination.interceptor';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalFilters(
    new EntityValidationErrorFilter(),
    new NotFoundErrorFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
  app.useGlobalInterceptors(
    new PaginationInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}
