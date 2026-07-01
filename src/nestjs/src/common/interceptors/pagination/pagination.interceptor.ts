import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { map, type Observable } from "rxjs";

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
	intercept(
		_context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> {
		return next.handle().pipe(
			map((body) => {
				return !body || "meta" in body ? body : { data: body };
			}),
		);
	}
}
