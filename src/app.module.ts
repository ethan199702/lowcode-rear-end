import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule, RedisModule } from "./common/index.module";
import { UserModule } from "./modules";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "/.env"
    }),
    PrismaModule,
    RedisModule,
    UserModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
