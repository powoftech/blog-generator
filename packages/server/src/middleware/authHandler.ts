import { NextFunction, Request, Response } from 'express'

export const authHandler = (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction,
) => {
  // Check if user is authenticated
  if (!req.session.userId) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  // Attach userId to the request object
  req.userId = req.session.userId
  next()
}
