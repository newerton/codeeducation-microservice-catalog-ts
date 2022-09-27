import { Chance } from 'chance';

import { CategorySequelize } from '#category/infra';
import { setupSequelize } from '#seedwork/infra';

import { ListCategoriesUseCase } from '../../list-categories.use-case';

const { CategoryRepository, CategoryModel, CategoryModelMapper } =
  CategorySequelize;

describe('ListCategoriesUseCase Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  it('should return output using empty input with categories ordered by created_at', async () => {
    const models = await CategoryModel.factory()
      .count(2)
      .bulkCreate((index: number) => {
        const chance = new Chance();
        return {
          id: chance.guid({ version: 4 }),
          name: `Category ${index}`,
          description: 'some description',
          is_active: true,
          created_at: new Date(new Date().getTime() + index),
        };
      });

    const output = await useCase.execute({});
    expect(output).toMatchObject({
      items: [...models]
        .reverse()
        .map(CategoryModelMapper.toEntity)
        .map((item) => item.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should returns output using pagination, sort and filter', async () => {
    const models = await CategoryModel.factory().count(5).bulkMake();
    models[0].name = 'a';
    models[1].name = 'AAA';
    models[2].name = 'AaA';
    models[3].name = 'b';
    models[4].name = 'c';

    await CategoryModel.bulkCreate(models.map((item) => item.toJSON()));

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toMatchObject({
      items: [models[1], models[2]]
        .map(CategoryModelMapper.toEntity)
        .map((item) => item.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toMatchObject({
      items: [models[0]]
        .map(CategoryModelMapper.toEntity)
        .map((item) => item.toJSON()),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    });
    expect(output).toMatchObject({
      items: [models[0], models[2]]
        .map(CategoryModelMapper.toEntity)
        .map((item) => item.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
