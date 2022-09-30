import { Exclude, Expose } from 'class-transformer';

import {
  PaginationPresenter,
  PaginationPresenterProps,
} from './pagination.presenter';

export abstract class CollectionPresenter {
  @Exclude()
  protected page: PaginationPresenter;

  constructor(props: PaginationPresenterProps) {
    this.page = new PaginationPresenter(props);
  }

  @Expose({ name: 'meta' })
  get meta() {
    return this.page;
  }

  abstract get data();
}
