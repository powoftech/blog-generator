import 'dotenv/config'
import joi from 'joi'

const envVarsSchema = joi
  .object()
  .keys({
    NODE_ENV: joi
      .string()
      .valid('production', 'development', 'test')
      .default('development'),
    PORT: joi.number().positive().default(8000), // Default port 8000
    CLIENT_URL: joi.string().required().description('Client URL'),
    MONGO_URI: joi.string().required().description('MongoDB URI'),
    REDIS_URL: joi.string().required().description('Redis URL'),
    SESSION_SECRET: joi.string().required().description('JWT secret key'),
    GEMINI_API_KEY: joi.string().required().description('Gemini API key'),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export const envConfig = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoUri: envVars.MONGO_URI,
  redisUrl: envVars.REDIS_URL,
  sessionSecret: envVars.SESSION_SECRET,
  geminiApiKey: envVars.GEMINI_API_KEY,
  clientUrl: envVars.CLIENT_URL,
}
