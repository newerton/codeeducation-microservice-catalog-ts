import { Category } from '@fc/micro-videos/category/domain';

export class CategoryFixture {
  static keysInResponse() {
    return ['id', 'name', 'description', 'is_active', 'created_at'];
  }

  static forSave() {
    const faker = Category.fake()
      .aCategory()
      .withName('movie')
      .withDescription('test description');

    return [
      {
        data: {
          name: faker.name,
        },
        expected: {
          description: null,
          is_active: true,
        },
      },
      {
        data: {
          name: faker.name,
          description: null,
        },
        expected: {
          is_active: true,
        },
      },
      {
        data: {
          name: faker.name,
          is_active: true,
        },
        expected: {
          description: null,
        },
      },
      {
        data: {
          name: faker.name,
          description: faker.description,
          is_active: false,
        },
        expected: {},
      },
      {
        data: {
          name: faker.name,
          is_active: false,
        },
        expected: {
          description: null,
        },
      },
      {
        data: {
          name: faker.name,
          description: faker.description,
          is_active: true,
        },
        expected: {},
      },
    ];
  }

  static invalidRequest() {
    const faker = Category.fake().aCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        data: {},
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        data: {
          name: faker.withInvalidNameEmpty(undefined).name,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        data: {
          name: faker.withInvalidNameEmpty(null).name,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        data: {
          name: faker.withInvalidNameEmpty('').name,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      DESCRIPTION_NOT_A_STRING: {
        data: {
          description: faker.withInvalidDescriptionNotAString().description,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        data: {
          is_active: faker.withInvalidIsActiveNotABoolean().is_active,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    };
  }

  static forEntityValidationError() {
    const faker = Category.fake().aCategory();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      NAME_UNDEFINED: {
        data: {
          name: faker.withInvalidNameEmpty(undefined).name,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      NAME_NULL: {
        data: {
          name: faker.withInvalidNameEmpty(null).name,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
          ...defaultExpected,
        },
      },
      NAME_EMPTY: {
        data: {
          name: faker.withInvalidNameEmpty('').name,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },

      DESCRIPTION_NOT_A_STRING: {
        data: {
          description: faker.withInvalidDescriptionNotAString().description,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        data: {
          is_active: faker.withInvalidIsActiveNotABoolean().is_active,
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'is_active must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    };
  }
}

export class CreateCategoryFixture {
  static keysInResponse() {
    return CategoryFixture.keysInResponse();
  }

  static forSave() {
    return CategoryFixture.forSave();
  }

  static invalidRequest() {
    return CategoryFixture.invalidRequest();
  }

  static forEntityValidationError() {
    return CategoryFixture.forEntityValidationError();
  }
}

export class UpdateCategoryFixture {
  static keysInResponse() {
    return CategoryFixture.keysInResponse();
  }

  static forSave() {
    return CategoryFixture.forSave();
  }

  static invalidRequest() {
    return CategoryFixture.invalidRequest();
  }

  static forEntityValidationError() {
    // remove an update case that never happens
    const { ...otherKeys } = CategoryFixture.forEntityValidationError();
    return otherKeys;
  }
}

export class ListCategoriesFixture {
  static incrementedWithCreatedAt() {
    const _entities = Category.fake()
      .theCategories(4)
      .withName((i) => i + '')
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
      {
        data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static unsorted() {
    const faker = Category.fake().aCategory();

    const entitiesMap = {
      a: faker.withName('a').build(),
      AAA: faker.withName('AAA').build(),
      AaA: faker.withName('AaA').build(),
      b: faker.withName('b').build(),
      c: faker.withName('c').build(),
    };

    const arrange = [
      {
        data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.AAA, entitiesMap.AaA],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
      },
      {
        data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: 'a',
        },
        expected: {
          entities: [entitiesMap.a],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
