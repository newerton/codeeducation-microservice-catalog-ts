import { Category, type CategoryRepository } from "#category/domain";
import type { default as DefaultUseCase } from "#seedwork/application/use-case";

import {
	type CategoryOutput,
	CategoryOutputMapper,
} from "../dto/category-output";

export namespace CreateCategoryUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private categoryRepo: CategoryRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const entity = new Category(input);
			await this.categoryRepo.insert(entity);
			return CategoryOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		name: string;
		description?: string;
		is_active?: boolean;
	};

	export type Output = CategoryOutput;
}
