import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '#seedwork/domain';

import { Category } from '../entities';

export namespace CategoryRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<Category, Filter> {}

  export type Repository = SearchableRepositoryInterface<
    Category,
    Filter,
    SearchParams,
    SearchResult
  >;
}
