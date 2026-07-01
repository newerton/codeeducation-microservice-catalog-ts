import { Transform } from "class-transformer";

export type PaginationPresenterProps = {
	current_page: number;
	per_page: number;
	last_page: number;
	total: number;
};

export class PaginationPresenter {
	@Transform(({ value }) => parseInt(value, 10))
	current_page: number;
	@Transform(({ value }) => parseInt(value, 10))
	per_page: number;
	@Transform(({ value }) => parseInt(value, 10))
	last_page: number;
	@Transform(({ value }) => parseInt(value, 10))
	total: number;

	constructor(props: PaginationPresenterProps) {
		this.current_page = props.current_page;
		this.per_page = props.per_page;
		this.last_page = props.last_page;
		this.total = props.total;
	}
}
