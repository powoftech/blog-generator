import { NextFunction, Request, Response } from 'express'
import { envConfig } from '../utils/envConfig'

interface AppError extends Error {
  status?: number
  code?: string
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong'

  console.error(`[Error] ${status} - ${message}`)
  if (envConfig.nodeEnv !== 'production') {
    console.error(err.stack)
  }

  res.status(status).json({
    error: {
      message,
      code: err.code || 'INTERNAL_SERVER_ERROR',
      ...(envConfig.nodeEnv !== 'production' ? { stack: err.stack } : {}),
    },
  })
}
