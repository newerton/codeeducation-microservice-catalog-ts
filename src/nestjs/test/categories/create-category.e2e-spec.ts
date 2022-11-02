import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { HttpStatus } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';

import { CategoriesController } from '@categories/categories.controller';
import { CreateCategoryFixture } from '@categories/fixtures';
import { CATEGORY_PROVIDERS } from '@categories/providers/category.provider';
import { startApp } from '@common/testing/helpers';

describe('CategoriesController (e2e)', () => {
  describe('/categories (POST)', () => {
    describe('should have response 422 with invalid request body', () => {
      const app = startApp();
      const invalidRequest = CreateCategoryFixture.invalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .post('/categories')
          .send(value.data)
          .expect(HttpStatus.UNPROCESSABLE_ENTITY)
          .expect(value.expected);
      });
    });

    describe('should have response 422 to EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = []; // cancel NestJS validation at DTO
        },
      });
      const validationError = CreateCategoryFixture.forEntityValidationError();
      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .post('/categories')
          .send(value.data)
          .expect(HttpStatus.UNPROCESSABLE_ENTITY)
          .expect(value.expected);
      });
    });

    describe('should create a category', () => {
      const app = startApp();
      const arrange = CreateCategoryFixture.forSave();
      let categoryRepo: CategoryRepository.Repository;

      beforeEach(async () => {
        const sequelize = app.app.get(getConnectionToken());
        await sequelize.sync({ force: true });

        categoryRepo = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });

      test.each(arrange)('when body is $data', async ({ data, expected }) => {
        const res = await request(app.app.getHttpServer())
          .post('/categories')
          .send(data)
          .expect(201);
        const keyInResponse = CreateCategoryFixture.keysInResponse();
        expect(Object.keys(res.body)).toStrictEqual(['data']);
        expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
        const categoryCreated = await categoryRepo.findById(res.body.data.id);
        const presenter = CategoriesController.toResponse(
          categoryCreated.toJSON(),
        );
        const serialized = instanceToPlain(presenter);
        expect(res.body.data).toStrictEqual({
          id: serialized.id,
          created_at: serialized.created_at,
          ...data,
          ...expected,
        });
      });
    });
  });
});
