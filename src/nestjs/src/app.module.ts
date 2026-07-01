import { CategoriesModule } from "@categories/categories.module";
import { ConfigModule } from "@common/config/config.module";
import { DatabaseModule } from "@common/database/database.module";
import { Module } from "@nestjs/common";

@Module({
	controllers: [],
	providers: [],
	imports: [ConfigModule.forRoot(), CategoriesModule, DatabaseModule],
})
export class AppModule {}
