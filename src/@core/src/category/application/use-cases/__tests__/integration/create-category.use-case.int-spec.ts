import exp from 'constants';

import { CategorySequelize } from '#category/infra';
import { setupSequelize } from '#seedwork/infra';

import { CreateCategoryUseCase } from '../../create-category.use-case';

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe('CreateCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  let useCase: CreateCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new CreateCategoryUseCase.UseCase(repository);
  });

  describe('test with test.each', () => {
    const arrange = [
      {
        input: { name: 'test' },
        output: {
          name: 'test',
          description: null,
          is_active: true,
        },
      },
      {
        input: {
          name: 'test',
          description: 'some description',
          is_active: false,
        },
        output: {
          name: 'test',
          description: 'some description',
          is_active: false,
        },
      },
      {
        input: {
          name: 'test',
          description: 'some description',
          is_active: true,
        },
        output: {
          name: 'test',
          description: 'some description',
          is_active: true,
        },
      },
    ];

    test.each(arrange)('validate %j', async (item) => {
      const output = await useCase.execute(item.input);
      const entity = await repository.findById(output.id);
      expect(output.id).toBe(entity.id);
      expect(output).toMatchObject(item.output);
    });
  });
  it('should create a category', async () => {
    let output = await useCase.execute({ name: 'test' });
    let entity = await repository.findById(output.id);

    expect(output).toStrictEqual({
      id: entity.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: false,
    });
    entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'test',
      description: 'some description',
      is_active: false,
      created_at: entity.created_at,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: true,
    });
    entity = await repository.findById(output.id);
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'test',
      description: 'some description',
      is_active: true,
      created_at: entity.created_at,
    });
  });
});
