import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response, Router } from 'express'
import User from '../models/user.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.session.userId)
      .select('_id email')
      .exec()
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.status(200).json({ id: user._id, email: user.email })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: errorMessage })
  }
})

// Signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    console.log(email, password)

    // Check for required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
    }

    // Check for existing user
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      console.log(existingUser)
      res.status(409).json({ error: 'User already exists' })
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    if (!hashedPassword) {
      res.status(500).json({ error: 'Error hashing password' })
      return
    }

    // Create new user
    const user = await User.create({
      email: email,
      password: hashedPassword,
    })

    if (!user) {
      res.status(500).json({ error: 'Error creating user' })
      return
    }

    // Set session cookie
    req.session.userId = user._id.toString()

    res.status(201).json('User created successfully')
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: errorMessage })
  }
})

// Login
router.post(
  '/signin',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body
      // Check for required fields
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' })
        return
      }

      // Check for existing user
      const user = await User.findOne({ email: email })

      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: 'Invalid email or password' })
        return
      }

      req.session.userId = user._id.toString()

      res.status(200).json({ message: 'User logged in successfully' })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  },
)

router.post(
  '/signout',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          res.status(500).json({ error: 'Error signing out' })
          return
        }
        res.clearCookie('connect.sid', { path: '/' })
        res.status(200).json({ message: 'User logged out successfully' })
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: errorMessage })
    }
  },
)

export default router
