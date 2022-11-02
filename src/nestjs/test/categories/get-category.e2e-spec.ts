import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';

import { CategoriesController } from '@categories/categories.controller';
import { CategoryFixture } from '@categories/fixtures';
import { CATEGORY_PROVIDERS } from '@categories/providers/category.provider';
import { startApp } from '@common/testing/helpers';

describe('CategoriesController (e2e)', () => {
  const nestApp = startApp();

  describe('/categories/:id (GET)', () => {
    describe('should handle response when id is invalid or not found', () => {
      const arrange = [
        {
          id: '957334c5-91b9-4986-9b43-0d42f2edfbe9',
          expected: {
            message:
              'Entity Not Found using ID 957334c5-91b9-4986-9b43-0d42f2edfbe9',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake-id',
          expected: {
            message: 'Validation failed (uuid is expected)',
            statusCode: 422,
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/categories/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a category', async () => {
      const categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const category = Category.fake().aCategory().build();
      categoryRepo.insert(category);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/categories/${category.id}`)
        .expect(200);
      const keyInResponse = CategoryFixture.keysInResponse();
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

      const presenter = CategoriesController.toResponse(category.toJSON());
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
