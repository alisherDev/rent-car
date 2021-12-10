import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AutoModule } from "./auto/auto.module";
import { RentModule } from './rent/rent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    AutoModule,
    RentModule,
  ],
})
export class AppModule {}
