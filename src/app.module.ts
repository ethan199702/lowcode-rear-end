import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR, APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule, RedisModule } from "./common/index.module";
import { UserModule } from "./modules";
import { FormatResponseInterceptor } from "./common/interceptor/format-response.interceptor";
import { LoginGuard } from "./common/guard/login.guard";

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
  providers: [
    /** 因为FormatResponseInterceptor 中需要使用Reflector，通过依赖注入方式获取，
     * 所以这里不能 在main.ts中手动调用这个拦截器
     * */
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: LoginGuard
    }
  ]
})
export class AppModule {}
