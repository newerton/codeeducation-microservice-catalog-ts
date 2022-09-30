import {
  CategoryInMemoryRepository,
  CategorySequelize,
} from '@fc/micro-videos/category/infra';
import { getModelToken } from '@nestjs/sequelize';

const CATEGORY_IN_MEMORY_REPOSITORY = {
  provide: 'CategoryInMemoryRepository',
  useClass: CategoryInMemoryRepository,
};

const CATEGORY_SEQUELIZE_REPOSITORY = {
  provide: 'CategorySequelizeRepository',
  useFactory: (categoryModel: typeof CategorySequelize.CategoryModel) => {
    return new CategorySequelize.CategoryRepository(categoryModel);
  },
  inject: [getModelToken(CategorySequelize.CategoryModel)],
};

const CATEGORY_REPOSITORY = {
  provide: 'CategoryRepository',
  useExisting: 'CategorySequelizeRepository',
};

export const REPOSITORIES = {
  CATEGORY_IN_MEMORY_REPOSITORY,
  CATEGORY_SEQUELIZE_REPOSITORY,
  CATEGORY_REPOSITORY,
};
