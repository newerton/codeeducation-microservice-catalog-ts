import {
  CategoryInMemoryRepository,
  CategorySequelize,
} from '@fc/micro-videos/category/infra';
import { getModelToken } from '@nestjs/sequelize';

export const CATEGORY_IN_MEMORY_REPOSITORY = {
  provide: 'CategoryInMemoryRepository',
  useClass: CategoryInMemoryRepository,
};

export const CATEGORY_SEQUELIZE_REPOSITORY = {
  provide: 'CategorySequelizeRepository',
  useFactory: (categoryModel: typeof CategorySequelize.CategoryModel) => {
    return new CategorySequelize.CategoryRepository(categoryModel);
  },
  inject: [getModelToken(CategorySequelize.CategoryModel)],
};

export const CATEGORY_REPOSITORY = {
  provide: 'CategoryRepository',
  useExisting: 'CategorySequelizeRepository',
};

export const REPOSITORIES = {
  CATEGORY_IN_MEMORY_REPOSITORY,
  CATEGORY_SEQUELIZE_REPOSITORY,
  CATEGORY_REPOSITORY,
};
