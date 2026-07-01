import { CategoryRepository } from "#category/domain";
import {
	type PaginationOutputDto,
	PaginationOutputMapper,
	type SearchInputDto,
} from "#seedwork/application";
import type { default as DefaultUseCase } from "#seedwork/application/use-case";

import { type CategoryOutput, CategoryOutputMapper } from "../dto";

export namespace ListCategoriesUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private categoryRepo: CategoryRepository.Repository) {}
		//
		async execute(input: Input): Promise<Output> {
			const params = new CategoryRepository.SearchParams(input);
			const searchResult = await this.categoryRepo.search(params);
			return this.toOutput(searchResult);
		}

		private toOutput(searchResult: CategoryRepository.SearchResult): Output {
			const items = searchResult.items.map((i) => {
				return CategoryOutputMapper.toOutput(i);
			});
			return PaginationOutputMapper.toOutput(items, searchResult);
		}
	}

	export type Input = SearchInputDto;

	export type Output = PaginationOutputDto<CategoryOutput>;
}
