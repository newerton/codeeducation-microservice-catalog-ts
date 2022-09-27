import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CategoriesModule } from '@categories/categories.module';
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
