import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CategoryRepository } from '@fc/micro-videos/category/domain';

import { REPOSITORIES } from './category.repository.provider';

const CREATE_CATEGORY_USE_CASE = {
  provide: CreateCategoryUseCase.UseCase,
  useFactory: (categoryRepo: CategoryRepository.Repository) => {
    return new CreateCategoryUseCase.UseCase(categoryRepo);
  },
  inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
};

const UPDATE_CATEGORY_USE_CASE = {
  provide: UpdateCategoryUseCase.UseCase,
  useFactory: (categoryRepo: CategoryRepository.Repository) => {
    return new UpdateCategoryUseCase.UseCase(categoryRepo);
  },
  inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
};

const LIST_CATEGORIES_USE_CASE = {
  provide: ListCategoriesUseCase.UseCase,
  useFactory: (categoryRepo: CategoryRepository.Repository) => {
    return new ListCategoriesUseCase.UseCase(categoryRepo);
  },
  inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
};

const GET_CATEGORY_USE_CASE = {
  provide: GetCategoryUseCase.UseCase,
  useFactory: (categoryRepo: CategoryRepository.Repository) => {
    return new GetCategoryUseCase.UseCase(categoryRepo);
  },
  inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
};

const DELETE_CATEGORY_USE_CASE = {
  provide: DeleteCategoryUseCase.UseCase,
  useFactory: (categoryRepo: CategoryRepository.Repository) => {
    return new DeleteCategoryUseCase.UseCase(categoryRepo);
  },
  inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
};

export const USE_CASES = {
  CREATE_CATEGORY_USE_CASE,
  UPDATE_CATEGORY_USE_CASE,
  LIST_CATEGORIES_USE_CASE,
  GET_CATEGORY_USE_CASE,
  DELETE_CATEGORY_USE_CASE,
};
