import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule, RedisModule } from "./common/index.module";
import { UserModule } from "./modules";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "/.env"
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: configService.get("JWT_ACCESS_TOKEN_EXPIRES")
          }
        };
      },
      inject: [ConfigService]
    }),
    PrismaModule,
    RedisModule,
    UserModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
