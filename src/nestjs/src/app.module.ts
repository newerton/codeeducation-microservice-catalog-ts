import { Module } from '@nestjs/common';

import { CategoriesModule } from '@categories/categories.module';
import { ConfigModule } from '@common/config/config.module';
import { DatabaseModule } from '@common/database/database.module';
import { ShareModule } from '@common/share/share.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot(),
    CategoriesModule,
    DatabaseModule,
    ShareModule,
  ],
})
export class AppModule {}
