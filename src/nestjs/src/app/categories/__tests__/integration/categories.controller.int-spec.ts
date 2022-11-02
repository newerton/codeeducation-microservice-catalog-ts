import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import { Test, TestingModule } from '@nestjs/testing';

import { CATEGORY_PROVIDERS } from '@categories/providers/category.provider';
import { ConfigModule } from '@common/config/config.module';
import { DatabaseModule } from '@common/database/database.module';

import { CategoriesController } from '../../categories.controller';
import { CategoriesModule } from '../../categories.module';
import {
  CategoryFixture,
  ListCategoriesFixture,
  UpdateCategoryFixture,
} from '../../fixtures';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../../presenter/category.presenter';

describe('CategoriesController Integration Tests', () => {
  let controller: CategoriesController;
  let repository: CategoryRepository.Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get(CategoriesController);
    repository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
  });

  it('should create a category', async () => {
    const presenter = await controller.create({
      name: 'Movie',
    });
    const entity = await repository.findById(presenter.id);

    expect(entity).toMatchObject({
      id: presenter.id,
      name: 'Movie',
      description: null,
      is_active: true,
      created_at: presenter.created_at,
    });

    expect(presenter.id).toBe(entity.id);
    expect(presenter.name).toBe('Movie');
    expect(presenter.description).toBeNull();
    expect(presenter.name).toBeTruthy();
    expect(presenter.created_at).toStrictEqual(entity.created_at);
  });

  describe('should create a category (with fixture & testEach)', () => {
    const arrange = CategoryFixture.forSave();

    test.each(arrange)('when body is $data', async ({ data, expected }) => {
      const presenter = await controller.create(data);
      const entity = await repository.findById(presenter.id);

      expect(entity.toJSON()).toStrictEqual({
        id: presenter.id,
        created_at: presenter.created_at,
        ...data,
        ...expected,
      });

      expect(presenter).toEqual(new CategoryPresenter(entity));
    });
  });

  describe('should update a category (with fake & fixture)', () => {
    const arrange = UpdateCategoryFixture.forSave();

    const category = Category.fake().aCategory().build();

    beforeEach(async () => {
      await repository.insert(category);
    });

    test.each(arrange)('with request $data', async ({ data, expected }) => {
      const presenter = await controller.update(category.id, data);
      const entity = await repository.findById(presenter.id);

      expect(entity).toMatchObject({
        id: presenter.id,
        created_at: presenter.created_at,
        ...data,
        ...expected,
      });

      expect(presenter).toEqual(new CategoryPresenter(entity));
    });
  });

  it('should delete a category with Category.fake()', async () => {
    const category = Category.fake().aCategory().build(); // no more CategorySequelize dependency!
    await repository.insert(category);
    const response = await controller.remove(category.id);
    expect(response).not.toBeDefined();
    await expect(repository.findById(category.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${category.id}`),
    );
  });

  it('should get a category with Category.fake()', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const presenter = await controller.findOne(category.id);

    expect(presenter.id).toBe(category.id);
    expect(presenter.name).toBe(category.name);
    expect(presenter.description).toBe(category.description);
    expect(presenter.is_active).toBe(category.is_active);
    expect(presenter.created_at).toStrictEqual(category.created_at);
  });

  describe('search method', () => {
    describe('should return categories ordered by created_at when query is empty (with fixture)', () => {
      const { entitiesMap, arrange } =
        ListCategoriesFixture.incrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });
      test.each(arrange)('when data is $data', async ({ data, expected }) => {
        const presenter = await controller.search(data);
        const { entities, ...paginationProps } = expected;
        expect(presenter).toEqual(
          new CategoryCollectionPresenter({
            items: entities,
            ...paginationProps.meta,
          }),
        );
      });
    });

    describe('should combine output with pagination, sort and filter (with fixture)', () => {
      const { entitiesMap, arrange } = ListCategoriesFixture.unsorted();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)('when data is $data', async ({ data, expected }) => {
        const presenter = await controller.search(data);
        const { entities, ...paginationProps } = expected;
        expect(presenter).toEqual(
          new CategoryCollectionPresenter({
            items: entities,
            ...paginationProps.meta,
          }),
        );
      });
    });
  });
});
