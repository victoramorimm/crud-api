export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/crud-ts-api',
  port: process.env.PORT || 2727,
  jwtSecret: process.env.JWT_SECRET || 'adç1q4,CAçt1230'
}
