import { SortDirection } from '@fc/micro-videos/@seedwork/domain';
import { ListCategoriesUseCase } from '@fc/micro-videos/category/application';

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
