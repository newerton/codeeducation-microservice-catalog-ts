import { ValidationError } from '#seedwork/domain/errors';

import { ValidatorRules, isEmpty } from '../validator-rules';

type Values = {
  value: any;
  property: string;
};

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
};

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrow(expected.error);
}

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, 'error'>) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule] as (...args: any[]) => ValidatorRules;
  method.apply(validator, params);
}

describe('ValidatorRules Unit Tests', () => {
  test('values method', () => {
    const validator = ValidatorRules.values('some value', 'field');
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator['value']).toBe('some value');
    expect(validator['property']).toBe('field');
  });

  describe('required validation rule', () => {
    //invalid cases
    let arrange: Values[] = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: '', property: 'field' },
    ];
    const error = new ValidationError('The field is required');
    test.each(arrange)('validate %j', (item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'required',
        error,
      });
    });

    //valid cases
    arrange = [
      { value: 'test', property: 'field' },
      { value: 5, property: 'field' },
      { value: 0, property: 'field' },
      { value: false, property: 'field' },
    ];

    test.each(arrange)('validate %j', (item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'required',
        error,
      });
    });
  });

  describe('string validation rule', () => {
    let arrange: Values[] = [
      { value: 5, property: 'field' },
      { value: {}, property: 'field' },
      { value: false, property: 'field' },
    ];
    const error = new ValidationError('The field must be a string');
    test.each(arrange)('validate %j', (item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'string',
        error,
      });
    });

    //valid cases
    arrange = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: 'test', property: 'field' },
    ];

    test.each(arrange)('validate %j', (item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'string',
        error,
      });
    });
  });

  describe('maxLength validation rule', () => {
    //invalid cases
    let arrange: Values[] = [{ value: 'aaaaaa', property: 'field' }];
    const error = new ValidationError(
      'The field must be less or equal than 5 characters',
    );
    test.each(arrange)('validate %j', (item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'maxLength',
        error,
        params: [5],
      });
    });

    //valid cases
    arrange = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: 'aaaaa', property: 'field' },
    ];

    test.each(arrange)('validate %j', (item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'maxLength',
        error,
        params: [5],
      });
    });
  });

  describe('boolean validation rule', () => {
    //invalid cases
    let arrange: Values[] = [
      { value: 5, property: 'field' },
      { value: 'true', property: 'field' },
      { value: 'false', property: 'field' },
    ];
    const error = new ValidationError('The field must be a boolean');
    test.each(arrange)('validate %j', (item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'boolean',
        error,
      });
    });

    //valid cases
    arrange = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: false, property: 'field' },
      { value: true, property: 'field' },
    ];

    test.each(arrange)('validate %j', (item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'boolean',
        error,
        params: [5],
      });
    });
  });

  it('should throw a validation error when combine two or more validation rules', () => {
    let validator = ValidatorRules.values(null, 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(new ValidationError('The field is required'));

    validator = ValidatorRules.values(5, 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(new ValidationError('The field must be a string'));

    validator = ValidatorRules.values('aaaaaa', 'field');
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(
      new ValidationError('The field must be less or equal than 5 characters'),
    );

    validator = ValidatorRules.values(null, 'field');
    expect(() => {
      validator.required().boolean();
    }).toThrow(new ValidationError('The field is required'));

    validator = ValidatorRules.values(5, 'field');
    expect(() => {
      validator.required().boolean();
    }).toThrow(new ValidationError('The field must be a boolean'));
  });

  it('should valid when combine two or more validation rules', () => {
    expect.assertions(0);
    ValidatorRules.values('test', 'field').required().string();
    ValidatorRules.values('aaaaa', 'field').required().string().maxLength(5);

    ValidatorRules.values(true, 'field').required().boolean();
    ValidatorRules.values(false, 'field').required().boolean();
  });

  it('should valid when combine two or more validation rules', () => {
    const value_undefined = isEmpty(undefined);
    expect(value_undefined).toBeTruthy();

    const value_null = isEmpty(null);
    expect(value_null).toBeTruthy();

    const value_empty = isEmpty('');
    expect(value_empty).toBeFalsy();

    const value_string = isEmpty('abc');
    expect(value_string).toBeFalsy();

    const value_number = isEmpty(123);
    expect(value_number).toBeFalsy();
  });
});
