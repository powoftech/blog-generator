import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextFunction, Request, Response, Router } from 'express'
import { authHandler } from '../middleware/authHandler'
import Blog from '../models/blog'
import { envConfig } from '../utils/envConfig'

const router = Router()

const genAI = new GoogleGenerativeAI(envConfig.geminiApiKey)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
}

// Generate blog content
router.post('/generate', authHandler, async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    })

    const result = await chatSession.sendMessage(
      `Write a blog post about ${prompt}`,
    )

    res.json({ content: result.response.text() })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res.status(500).send('Error generating content: ' + errorMessage)
  }
})

// Save blog
router.post(
  '/',
  authHandler,
  async (req: Request & { userId?: string }, res: Response) => {
    try {
      const { title, content } = req.body
      const blog = new Blog({ title, content, author: req.userId })
      await blog.save()
      res.status(201).json(blog)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(400).send('Error saving blog: ' + errorMessage)
    }
  },
)

// Get all blogs for the user
router.get(
  '/',
  authHandler,
  async (req: Request & { userId?: string }, res: Response) => {
    try {
      const blogs = await Blog.find({ author: req.userId })
      res.json(blogs)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).send('Error fetching blogs: ' + errorMessage)
    }
  },
)

// Additional CRUD endpoints (e.g., update, delete) can be added here.

export default router
