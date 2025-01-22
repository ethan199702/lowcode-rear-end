import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";

@Injectable()
export class RedisService {
  @Inject("REDIS_CLIENT")
  private readonly redisClient: RedisClientType;

  async get(k: string) {
    return await this.redisClient.get(k);
  }

  /**
   * @description 设置redis键值对
   * @param k 键
   * @param v 值
   * @param ttl 过期时间
   */
  async set(k: string, v: string | number, ttl?: number) {
    await this.redisClient.set(k, v);
    if (ttl) await this.redisClient.expire(k, ttl);
  }

  async del(k: string) {
    await this.redisClient.del(k);
  }
}
