const express = require("express");
const redis = require("redis");

const app = express();

const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";
const REDIS_PORT = process.env.REDIS_PORT ?? 6379;
const PORT = process.env.PORT ?? 3000;

const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

app.get("/messages", async (req, res) => {
  const messages = await redisClient.LRANGE("messages", 0, -1);
  res.json(messages);
});

app.post("/messages", express.text(), async (req, res) => {
  await redisClient.LPUSH("messages", req.body);
  res.status(201).send();
});

redisClient.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
