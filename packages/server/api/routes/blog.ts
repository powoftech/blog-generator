import { GoogleGenerativeAI } from '@google/generative-ai'
import { Request, Response, Router } from 'express'
import mime from 'mime-types'
import fs from 'node:fs'
import { authHandler } from '../middleware/authHandler.js'
import Blog from '../models/blog.js'
import { envConfig } from '../utils/envConfig.js'

const router = Router()

const genAI = new GoogleGenerativeAI(envConfig.geminiApiKey)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 4096,
  responseModalities: ['text'],
  responseMimeType: 'application/json',
}

// Generate blog content
router.post('/generate', authHandler, async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    })

    const result = await chatSession.sendMessage(`User prompt: "${prompt}".
      
      You are a helpful assistant that generates blog posts based on user prompts.
      
              Your responses must be a JSON object has the following schema:
              * title: Title of the blog post
              * content: Content of the blog post in markdown format
      `)

    // if (!result.response) {
    //   res
    //     .status(500)
    //     .json({ error: 'Error generating content: No response received' })
    //   return
    // }

    // const candidates = result.response.candidates
    // if (candidates) {
    //   for (
    //     let candidate_index = 0;
    //     candidate_index < candidates.length;
    //     candidate_index++
    //   ) {
    //     for (
    //       let part_index = 0;
    //       part_index < candidates[candidate_index].content.parts.length;
    //       part_index++
    //     ) {
    //       const part = candidates[candidate_index].content.parts[part_index]
    //       if (part.inlineData) {
    //         try {
    //           const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`
    //           fs.writeFileSync(
    //             filename,
    //             Buffer.from(part.inlineData.data, 'base64'),
    //           )
    //           console.log(`Output written to: ${filename}`)
    //         } catch (err) {
    //           console.error(err)
    //         }
    //       }
    //     }
    //   }
    //   console.log(result.response.text())
    // }

    // const text = result.response.text()
    // const cleanText = text.replace(/^```markdown\n?/, '').replace(/```$/, '')

    // const title = cleanText.split('\n')[0]
    // const content = cleanText.split('\n').slice(1).join('\n').trim()

    // res.json({ title, content })

    if (
      result.response.promptFeedback &&
      result.response.promptFeedback.blockReason
    ) {
      throw new Error(
        `Blocked for ${result.response.promptFeedback.blockReason}`,
      )
    }
    const cleanJson = JSON.parse(result.response.text())
    const title = cleanJson.title
    const content = cleanJson.content

    // console.log(title, content)

    res.status(200).json({ title: title, content: content })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: 'Error generating content: ' + errorMessage })
  }
})

// Save blog
router.post(
  '/',
  authHandler,
  async (req: Request & { userId?: string }, res: Response) => {
    try {
      const { title, content } = req.body
      // const blog = new Blog({ title, content, author: req.userId })
      // await blog.save()

      const blog = await Blog.create({
        author: req.userId,
        title: title,
        content: content,
      })
      if (!blog) {
        throw new Error()
      }
      res.status(201).json({ message: 'Blog saved successfully!' })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: 'Error saving blog: ' + errorMessage })
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
      res.status(500).json({ error: 'Error fetching blogs: ' + errorMessage })
    }
  },
)

// Additional CRUD endpoints (e.g., update, delete) can be added here.

export default router
