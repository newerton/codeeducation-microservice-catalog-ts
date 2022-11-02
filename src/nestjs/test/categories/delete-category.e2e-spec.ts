import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';
import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import request from 'supertest';

import { CATEGORY_PROVIDERS } from '@categories/providers/category.provider';
import { startApp } from '@common/testing/helpers';

describe('CategoriesController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const nestApp = startApp();

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
          .delete(`/categories/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a category with status 204', async () => {
      const categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const category = Category.fake().aCategory().build();
      await categoryRepo.insert(category);

      await request(nestApp.app.getHttpServer())
        .delete(`/categories/${category.id}`)
        .expect(204);

      await expect(categoryRepo.findById(category.id)).rejects.toThrow(
        new NotFoundError(`Entity Not Found using ID ${category.id}`),
      );
    });
  });
});
