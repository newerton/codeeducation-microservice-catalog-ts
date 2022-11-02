import { of } from 'rxjs';

import { PaginationInterceptor } from './pagination.interceptor';

describe('PaginationInterceptor Unit Test', () => {
  let interceptor: PaginationInterceptor;

  beforeEach(() => {
    interceptor = new PaginationInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrapper with data key', (done) => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });
    obs$
      .subscribe({
        next: (value) => {
          expect(value).toEqual({ data: { name: 'test' } });
        },
      })
      .add(done);
  });

  it('should not wrapper when meta key is not present', (done) => {
    const result = { data: [{ name: 'test' }], meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(result),
    });
    obs$
      .subscribe({
        next: (value) => {
          expect(value).toEqual(result);
        },
      })
      .add(done);
  });
});
