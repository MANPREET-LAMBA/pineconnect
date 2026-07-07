const Redis = require("ioredis")

function RedisCon(){
const redis = new Redis("redis://127.0.0.1:6379");
redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.log("Redis error:", err);
});
return redis

}

module.exports = RedisCon