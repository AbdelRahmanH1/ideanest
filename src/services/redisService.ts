import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export const initializeRedisClient = async () => {
  if (!client) {
    client = createClient();
    client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });
    client.on('connect', () => {
      console.log('Redis Connected');
    });
    await client.connect();
  }
  return client;
};

export const storeRefreshToken = async (
  userId: string,
  refreshToken: string,
) => {
  if (!client) await initializeRedisClient();

  await client?.set(userId, refreshToken, {
    EX: 7 * 24 * 60 * 60,
  });
};

export const getRefreshToken = async (userId: string) => {
  if (!client) await initializeRedisClient();
  return await client?.get(userId);
};

export const deleteRefreshToken = async (userId: string) => {
  if (!client) await initializeRedisClient();
  await client?.del(userId);
};
