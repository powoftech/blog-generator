import bodyParser from 'body-parser'
import compression from 'compression'
import { RedisStore } from 'connect-redis'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import helmet from 'helmet'
import { Redis } from 'ioredis'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.js'
import blogRoutes from './routes/blog.js'
import { envConfig } from './utils/envConfig.js'

const app = express()
const port = envConfig.port

mongoose.connect(envConfig.mongoUri, {
  dbName: envConfig.nodeEnv === 'production' ? 'tract' : 'tract_dev',
})

const redis = new Redis(envConfig.redisUrl)
const redisStore = new RedisStore({
  client: redis,
})

app
  .disable('x-powered-by')
  .use(helmet()) // Adds various HTTP headers for security
  .use(compression()) // Compress responses
  .use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
    }),
  )
  .use(morgan(envConfig.nodeEnv === 'production' ? 'combined' : 'dev'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json({ limit: '1mb' })) // Limit payload size
  .use(
    session({
      secret: envConfig.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: redisStore,
      cookie: {
        secure: envConfig.nodeEnv === 'production' ? true : false,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict',
        domain:
          envConfig.nodeEnv === 'production' ? envConfig.clientUrl : undefined,
      },
      rolling: true,
    }),
  )
  .use(
    cors({
      origin: envConfig.clientUrl,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      // allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  )
  .use(express.json())

app.use('/auth', authRoutes)
app.use('/blogs', blogRoutes)

// Error handling middleware (should be added after all routes)
app.use(errorHandler)

app.listen(port, () => {
  const expressVersion = '5.01'

  console.log(
    `  \x1b[1m\x1b[38;2;252;206;129m📦 Express ${expressVersion}\x1b[0m
   - Local:        http://localhost:${port}`,
  )
})
