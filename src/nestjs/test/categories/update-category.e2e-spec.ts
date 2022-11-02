import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import { HttpStatus } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';

import { CategoriesController } from '@categories/categories.controller';
import { UpdateCategoryFixture } from '@categories/fixtures';
import { CATEGORY_PROVIDERS } from '@categories/providers/category.provider';
import { startApp } from '@common/testing/helpers';

describe('CategoriesController (e2e)', () => {
  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  describe('PUT /categories/:id', () => {
    describe('should have response 422 with invalid request body', () => {
      const app = startApp();
      const invalidRequest = UpdateCategoryFixture.invalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .put(`/categories/${uuid}`)
          .send(value.data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should handle response when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = Category.fake().aCategory();
      const arrange = [
        {
          id: '957334c5-91b9-4986-9b43-0d42f2edfbe9',
          data: { name: faker.name },
          expected: {
            message:
              'Entity Not Found using ID 957334c5-91b9-4986-9b43-0d42f2edfbe9',
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Not Found',
          },
        },
        {
          id: 'fake-id',
          data: { name: faker.name },
          expected: {
            message: 'Validation failed (uuid is expected)',
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, data, expected }) => {
        return request(nestApp.app.getHttpServer())
          .put(`/categories/${id}`)
          .send(data)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    describe('should have response 422 to EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });
      const validationError = UpdateCategoryFixture.forEntityValidationError();
      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));
      let categoryRepo: CategoryRepository.Repository;

      beforeEach(async () => {
        categoryRepo = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });

      test.each(arrange)('when body is $label', async ({ value }) => {
        const category = Category.fake().aCategory().build();
        await categoryRepo.insert(category);
        return request(app.app.getHttpServer())
          .put(`/categories/${category.id}`)
          .send(value.data)
          .expect(HttpStatus.UNPROCESSABLE_ENTITY)
          .expect(value.expected);
      });
    });

    describe('should update a category', () => {
      const app = startApp();
      const arrange = UpdateCategoryFixture.forSave();
      let categoryRepo: CategoryRepository.Repository;

      beforeEach(async () => {
        const sequelize = app.app.get(getConnectionToken());
        await sequelize.sync({ force: true });

        categoryRepo = app.app.get<CategoryRepository.Repository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });

      test.each(arrange)('when body is $data', async ({ data, expected }) => {
        const categoryCreated = Category.fake().aCategory().build();
        await categoryRepo.insert(categoryCreated);
        const res = await request(app.app.getHttpServer())
          .put(`/categories/${categoryCreated.id}`)
          .send(data)
          .expect(HttpStatus.OK);
        const keyInResponse = UpdateCategoryFixture.keysInResponse();
        expect(Object.keys(res.body)).toStrictEqual(['data']);
        expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
        const categoryUpdated = await categoryRepo.findById(res.body.data.id);
        const presenter = CategoriesController.toResponse(
          categoryUpdated.toJSON(),
        );
        const serialized = instanceToPlain(presenter);
        // presenter: {... created_at: 2022-10-07T14:03:42.208Z }
        // serialized: {... created_at: '2022-10-07T14:03:42.208Z' }
        expect(res.body.data).toStrictEqual(serialized);
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
