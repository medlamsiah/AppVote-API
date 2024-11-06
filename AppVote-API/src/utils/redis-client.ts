import { createClient, RedisClientType } from 'redis';

export const client: RedisClientType = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,
  }
});
(async () => {
  try {
    await client.connect();  // Make sure to connect the client
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Redis connection failed:", error);
  }
})();